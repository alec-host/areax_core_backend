const { compare } = require("bcrypt");
const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getUserAcessTokenByEmail } = require("../user/get.user.access.token.by.email");
const { getUserRefreshTokenByEmail } = require("../user/get.user.refresh.token.by.email");
const { getReferenceNumberByEmail } = require('../user/get.user.reference_number.by.email');
const { getUserPasswordByEmail } = require("../user/get.user.paswd.by.email");

const { accessToken, refreshToken, rotateRefreshToken } = require("../../services/JWT");

exports.UserAuthentication = async(req,res) => {
    const { email,password } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       res.status(422).json({ success: false, error: false, message: errors.array() });
       return;
    }
    const email_found = await findUserCountByEmail(email);
    if(email_found === 0){
        res.status(404).json({
            success: false,
            error: true,
            message: "Email not found."
        });
        return;
    }

    const reference_number = await getReferenceNumberByEmail(email);
    const storedPasswordAndEmailVerification = await getUserPasswordByEmail(email);
    if(!storedPasswordAndEmailVerification[0]){
       res.status(400).json({
           success: false,
           error: true,
           message: "Sign up using Google Sigin Option."
       });	    
       return;
    }

    const allowedAccess = await compare(password,storedPasswordAndEmailVerification[0]);
    if(!allowedAccess){
       res.status(401).json({
           success: false,
           error: true,
           message: "Authentication has failed."
       });
       return;
    }	

    const _accessToken = accessToken({ email:email,reference_number:reference_number });
    const _refreshToken = refreshToken({email:email,reference_number:reference_number });

    res.status(200).json({
        success: true,
        error: false,
        access_token: _accessToken, refresh_token: _refreshToken,
        message: 'Authentication successful'
    });
};
