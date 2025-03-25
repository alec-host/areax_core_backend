const { OAuth2Client } = require("google-auth-library");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_ID_ANDROID, GOOGLE_CLIENT_ID_APPLE, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = require("../constants/app_constants");

module.exports.confirmGoogleToken = async(idToken) => {
    try{
       const audience = [
	   GOOGLE_CLIENT_ID,    
           GOOGLE_CLIENT_ID_ANDROID,
           GOOGLE_CLIENT_ID_APPLE,
        ];
       	const client = new OAuth2Client(GOOGLE_CLIENT_ID);
        const verifiedToken = await client.verifyIdToken({idToken,audience:audience});  
	const payload = verifiedToken.getPayload();
        return payload;
    }catch(error){
        console.error(error);
        return error;
    }
};

module.exports.confirmGoogleAndroidToken = async(idToken) => {
    try{
        const client = new OAuth2Client(GOOGLE_CLIENT_ID);
        const verifiedToken = await client.verifyIdToken({idToken,audience:GOOGLE_CLIENT_ID_ANDROID});
        const payload = verifiedToken.getPayload();
        return payload;
    }catch(error){
        console.error(error);
        return error;
    }
};

module.exports.confirmGoogleAppleToken = async(idToken) => {
    try{
        const client = new OAuth2Client(GOOGLE_CLIENT_ID);
        const verifiedToken = await client.verifyIdToken({idToken,audience:GOOGLE_CLIENT_ID_APPLE});
        const payload = verifiedToken.getPayload();
        return payload;
    }catch(error){
        console.error(error);
        return error;
    }
};
