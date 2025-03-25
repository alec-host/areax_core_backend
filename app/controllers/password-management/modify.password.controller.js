const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { encrypt } = require("../../services/CRYPTO");
const { modifyUserByEmail } = require("../user/modify.user.by.email");
const { confirmMailOtp } = require("../otp/confirm.mail.otp");
const { purgeOtp } = require("../otp/purge.mail.otp");

module.exports.ModifyPassword = async(req, res) => {
    const { email, reference_number, otp ,password, confirm_password } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const email_found = await findUserCountByEmail(email);
            if(email_found > 0){
                const reference_number_found = await findUserCountByReferenceNumber(reference_number);
                if(reference_number_found > 0){
	            const hasOtpMatched = await confirmMailOtp(otp,email);
		    if(hasOtpMatched){	
                    	if(password === confirm_password){
                             //-update pass.
                             const hashedPassword = await encrypt(password);
                             const newPassword = { password: hashedPassword };
                             const resp = await modifyUserByEmail(email,newPassword);
			     await purgeOtp(email); 	
                             if(resp){
                                  res.status(200).json({
                                      success: true,
                                      error: false,
                                      message: 'Password change was successful.'
                                  });                             
                             }else{
                                  res.status(400).json({
                                      success: false,
                                      error: true,
                                      message: 'Password change failed.'
                                  });                             
                             } 
                        }else{
                            res.status(400).json({
                                success: false,
                                error: true,
                                message: 'Passwords do not match.'
                            });                        
                        }
		    }else{
                        res.status(400).json({
                            success: false,
                            error: true,
                            message: 'Invalid OTP.'
                        });			
		    }
                }else{
                    res.status(404).json({
                        success: false,
                        error: true,
                        message: 'Reference number not found.'
                    }); 
                }
            }else{
                res.status(404).json({
                    success: false,
                    error: true,
                    message: 'Email not found.'
                });
            }
        }catch(e){
            if(e){
                res.status(500).json({
                    success: false,
                    error: true,
                    message: e?.response?.message || 'Something wrong has happened'
                });
            }           
        }
    }else{
        res.status(422).json({ success:false,error:true,message:errors.array() });
    }
};
