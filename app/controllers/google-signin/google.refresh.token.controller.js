const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getUserAcessTokenByEmail } = require("../user/get.user.access.token.by.email");
const { getUserRefreshTokenByEmail } = require("../user/get.user.refresh.token.by.email");
const { jwtVerifyRefreshToken } = require("../../services/JWT");

exports.SignInRefreshToken = async(req,res) => {
    const { email,reference_number } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        const email_found = await findUserCountByEmail(email);
        if(email_found > 0){
            const reference_number_found = await findUserCountByReferenceNumber(reference_number);
            if(reference_number_found > 0){
		const expiredToken = await getUserAcessTokenByEmail(email);    
		const accessToken = await getUserRefreshTokenByEmail(email);    
		jwtVerifyRefreshToken(accessToken).then(newToken => {
                    res.status(200).json({
                        success: true,
                        error: false,
			expired_token: expiredToken,    
                        access_token: newToken,
                        message: 'New access token generated.'
                    });
		}).catch(error => {
                    res.status(403).json({
                        success: false,
                        error: true,
                        message: error
                    });
		});
            }else{
                res.status(404).json({
                    success: false,
                    error: true,
                    message: "Reference number not found."
                }); 
            }
        }else{
            res.status(404).json({
                success: false,
                error: true,
                message: "Email not found."
            });
        }
    }else{
        res.status(422).json({ success: false, error: false, message: errors.array() });
    }
};
