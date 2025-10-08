const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getUserAcessTokenByEmail } = require("../user/get.user.access.token.by.email");
const { getUserRefreshTokenByEmail } = require("../user/get.user.refresh.token.by.email");
const { accessToken, refreshToken, rotateRefreshToken } = require("../../services/JWT");

exports.RotateRefreshToken = async(req,res) => {
    const { email,reference_number,old_refresh_token } = req.body;
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
    
    /*
    const reference_number_found = await findUserCountByReferenceNumber(reference_number);
    if(reference_number_found === 0){
        res.status(404).json({
            success: false,
            error: true,
            message: "Reference number not found."
        });
        return;
    }
    */
 
    const [ok,response] = rotateRefreshToken(old_refresh_token);
    
    if(!ok){
       res.status(400).json({
            success: false,
            error: true,
            message: response
       });
       return;
    }
    const { access_token, refresh_token, token_type, expires_in } = response;	
    res.status(200).json({
        success: true,
        error: false,
        access_token, refresh_token, token_type, expires_in,
	message: 'Generated token'    
    });	
};
