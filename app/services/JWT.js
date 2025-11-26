const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const { JWT_SECRET, JWT_REFRESH_SECRET, JWT_ISSUER, JWT_AUDIENCE, ACCESS_TTL, REFRESH_TTL  } = require("../constants/app_constants");

const CLOCK_TOLERANCE_SEC = 5;

const refreshStore = new Map();

const lastRotationSideChannel = new Map();

const sha256 = (s) => crypto.createHash("sha256").update(s, "utf8").digest("hex");
const nowSec = () => Math.floor(Date.now() / 1000);
const makeUserKey = ({ email, reference_number }) => `${email}::${reference_number}`;

const LEGACY_AUDIENCES = ("")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

// Helper so verify() can accept a list
function getAcceptedAudiences() {	
  //return LEGACY_AUDIENCES.length ? [JWT_AUDIENCE, ...LEGACY_AUDIENCES] : JWT_AUDIENCE;
  return [JWT_AUDIENCE, ...LEGACY_AUDIENCES].filter(Boolean);	
}

// ---- Core signers (internal)
function signAccess({ email, reference_number }) {
  const payload = {
    email: email,
    reference_number: reference_number,
    iat: nowSec(),
  };
  return jwt.sign(payload, JWT_SECRET, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE /*getAcceptedAudiences()*/,
    expiresIn: ACCESS_TTL,
    algorithm: "HS256",
  });
}

function signAndStoreRefresh({ email, reference_number }, meta = {}) {
  const jti = uuidv4();
  const payload = { email: email, reference_number: reference_number, jti };
  const token = jwt.sign(payload, JWT_REFRESH_SECRET, {
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE /*getAcceptedAudiences()*/,
    expiresIn: REFRESH_TTL,
    algorithm: "HS256",
  });

  const hash = sha256(token);
  const decoded = jwt.decode(token);
  refreshStore.set(jti, {
    userKey: makeUserKey({ email, reference_number }),
    hash,
    expiresAt: decoded?.exp ? decoded.exp * 1000 : Date.now() + 14 * 864e5,
    revoked: false,
    replacedBy: null,
    createdAt: Date.now(),
    meta,
  });

  return token;
}

module.exports.accessToken = (data) => {
  //-.Dervin recommendation: Increase to 1 hour for better user experience:	
  //const token = jwt.sign(data,JWT_SECRET,{expiresIn: '1h'});
  //return token;   
  const token = signAccess({ email: data.email, reference_number: data.reference_number });
  return token;
};

module.exports.refreshToken = (data, meta={}) => {
  //const refreshToken = jwt.sign(data,JWT_REFRESH_SECRET, { expiresIn: '14d' });
  //return refreshToken;
  return signAndStoreRefresh({ email: data.email, reference_number: data.reference_number }, meta);
};

module.exports.jwtVerifyToken = (token) => {
  //console.log("Signing with audience:", JWT_AUDIENCE);
  //console.log("Verifying against audiences:", getAcceptedAudiences());
  try {
    const decoded = jwt.verify(token, JWT_SECRET,{
       audience: getAcceptedAudiences(),
       issuer: JWT_ISSUER,
       algorithms: ["HS256"],
       clockTolerance: CLOCK_TOLERANCE_SEC,	    
    });	
    console.log("Verified token:", decoded);
	  
    return [true, decoded];
  } catch (error) {
    let err;
    switch (error.name) {
      case 'TokenExpiredError': err = 'Token Expired'; break;
      default: err = error.message || error.name; break;
    }
    return [false, err];
  }  
};

module.exports.jwtVerifyRefreshToken = (token, meta = {}) => {	
  return new Promise((resolve, reject) => {	
    jwt.verify(token,JWT_REFRESH_SECRET,{
	issuer: JWT_ISSUER,
	audience: JWT_AUDIENCE,
	algorithms: ["HS256"],
	clockTolerance: CLOCK_TOLERANCE_SEC, 
    },(err,user) => {
       if(err){
         reject(err.message);   
       }else{
         const token = jwt.sign({ email: user.email,reference_number: user.reference_number },
         JWT_SECRET,{ 
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,		 
            expiresIn: '1h',
            algorithm: "HS256",		 
	 });
         resolve(token);
       }
    });
  });
};

module.exports.jwtVerifyRefreshToken_ = (token, meta = {}) => {	
  return new Promise((resolve, reject) => {
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_REFRESH_SECRET, {
        clockTolerance: CLOCK_TOLERANCE_SEC,
        issuer: JWT_ISSUER,
        audience: /*JWT_AUDIENCE*/ getAcceptedAudiences(),
        algorithms: ["HS256"],
      });
    } catch (err) {
      return reject(err.name === "TokenExpiredError" ? "Refresh Token Expired" : err.message);
    }

    const { email: email, reference_number: reference_number, jti } = decoded || {};
    const rec = refreshStore.get(jti);

    if (!rec) return reject("Refresh token not recognized");
    if (rec.revoked) return reject("Refresh token revoked");
    if (rec.expiresAt <= Date.now()) return reject("Refresh token expired");

    // Ensure exact token by hash
    const incomingHash = sha256(token);
    if (incomingHash !== rec.hash) return reject("Refresh token mismatch");

    // ROTATE: revoke old & mint new refresh token
    rec.revoked = true;
    const newRefresh = signAndStoreRefresh({ email, reference_number }, meta);
    const newDecoded = jwt.decode(newRefresh);
    rec.replacedBy = newDecoded?.jti || null;

    // Side-channel: allow caller to fetch the rotated token if they want (optional)
    lastRotationSideChannel.set(jti, { newRefreshToken: newRefresh, createdAt: Date.now() });

    // As before: resolve ONLY a new access token (keeps existing code working)
    const newAccess = signAccess({ email, reference_number });
    resolve(newAccess);
  });
};

module.exports.rotateRefreshToken = (oldRefreshToken, meta = {}) => {
  let decoded;
  try {
    decoded = jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET, {
      clockTolerance: CLOCK_TOLERANCE_SEC,
      issuer: JWT_ISSUER,
      audience: /*JWT_AUDIENCE*/ getAcceptedAudiences(),
      algorithms: ["HS256"],
    });
  } catch (err) {
    const msg = err.name === "TokenExpiredError" ? "Refresh Token Expired" : err.message;
    return [false,`Error: ${msg}`];
  }
 
  const { email: email, reference_number: reference_number, jti } = decoded || {};
  const rec = refreshStore.get(jti);

  if (!rec) return [false,`Refresh token not recognized`];
  if (rec.revoked) [false,`Refresh token revoked`];
  if (rec.expiresAt <= Date.now()) [false,`Refresh token expired`];
  if (sha256(oldRefreshToken) !== rec.hash) [false,`Refresh token mismatch`];

  // revoke & mint new refresh
  rec.revoked = true;
  const newRefresh = signAndStoreRefresh({ email, reference_number }, meta);
  const newDecoded = jwt.decode(newRefresh);
  rec.replacedBy = newDecoded?.jti || null;

  const access_token = signAccess({ email, reference_number });
  return [true,{ access_token, refresh_token: newRefresh, token_type: "Bearer", expires_in: 60 * 60 }]; // 1h for compatibility
};

/**
 * Revoke a single refresh token (logout specific device).
 */
module.exports.revokeRefreshToken = (refreshToken) => {
  try {
    const { jti } = jwt.verify(refreshToken, JWT_REFRESH_SECRET, {
      clockTolerance: CLOCK_TOLERANCE_SEC,
      issuer: JWT_ISSUER,
      audience: /*JWT_AUDIENCE*/ getAcceptedAudiences(),
      algorithms: ["HS256"],
    });
    const rec = refreshStore.get(jti);
    if (rec) rec.revoked = true;
    return true;
  } catch {
    return false;
  }
};

/**
 * Revoke all refresh tokens for a user (global logout).
 */
module.exports.revokeAllForUser = ({ email, reference_number }) => {
  const userKey = makeUserKey({ email, reference_number });
  for (const [, rec] of refreshStore) {
    if (rec.userKey === userKey) rec.revoked = true;
  }
};

/**
 * Optional: Inspect a refresh session (jti linkage, revocation, expiry).
 */
module.exports.getRefreshSessionInfo = (refreshToken) => {
  try {
    const decoded = jwt.decode(refreshToken);
    const jti = decoded?.jti;
    if (!jti) return null;
    const rec = refreshStore.get(jti);
    if (!rec) return null;
    return {
      jti,
      revoked: rec.revoked,
      replacedBy: rec.replacedBy,
      expiresAt: rec.expiresAt,
      createdAt: rec.createdAt,
    };
  } catch {
    return null;
  }
};

/**
 * Optional: Given an *old* refresh token, fetch the *new* rotated token
 * if the app wants to update the client. This is purely optional and
 * preserves backward compatibility with jwtVerifyRefreshToken().
 */
module.exports.getRotatedRefreshTokenIfAny = (oldRefreshToken) => {
  try {
    const decoded = jwt.decode(oldRefreshToken);
    const jti = decoded?.jti;
    if (!jti) return null;
    const entry = lastRotationSideChannel.get(jti);
    return entry?.newRefreshToken || null;
  } catch {
    return null;
  }
};
