const { compare } = require("bcrypt");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { getUserPasswordByEmail } = require("../user/get.user.paswd.by.email");
const { modifyUserByEmail } = require("../user/modify.user.by.email");
const { accessToken, refreshToken } = require("../../services/JWT");
const { getUserProfileByEmail } = require("../user/get.user.profile.by.email");
const { getReferenceNumberByEmail } = require('../user/get.user.reference_number.by.email');
const { sendMessageToQueue } = require("../../services/RABBIT-MQ");
const { MEMORY_QUEUE_NAME } = require("../../constants/app_constants");
const { validationResult } = require("express-validator");

exports.SignIn = async(req,res) => {
    const { email,password } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const email_found = await findUserCountByEmail(email);
            if(email_found > 0){    
		const reference_number = await getReferenceNumberByEmail(email);    
                const storedPasswordAndEmailVerification = await getUserPasswordByEmail(email);    
		if(storedPasswordAndEmailVerification[0]){
		    const allowedAccess = await compare(password,storedPasswordAndEmailVerification[0]); 		
		    console.log(allowedAccess, '    ', storedPasswordAndEmailVerification);	
		    if(storedPasswordAndEmailVerification[1] > 0){    
                        const signIn = await modifyUserByEmail(email,{is_online:1});
                    	if(allowedAccess && signIn){
                             const _accessToken = accessToken({ email:email,reference_number:reference_number });
                             const _refreshToken = refreshToken({email:email,reference_number:reference_number });
                             await getUserProfileByEmail(email, async profileCallback => {
				 const reference_number =  profileCallback[0].reference_number;    
				 const message = 'Login was successful.';    
                                 const payload = {
                                     channel_name: 'activity_log',
			             email: email,		 
			             reference_number: reference_number,		 
                                     activity_name: `SIGN IN: ${message}`
                                 };
				 await sendMessageToQueue(MEMORY_QUEUE_NAME,JSON.stringify(payload));    
                                 res.status(200).json({
                                     success: true,
                                     error: false,
                                     data: profileCallback,
                                     access_token: _accessToken,
                                     refresh_token: _refreshToken,
                                     message: message
                                 });  
                             });
                    	}else{
                            res.status(401).json({
                                success: false,
                                error: true,
                                message: "Login has failed."
                            });                
                    	}
		    }else{
			if(allowedAccess){    
                            const _accessToken = accessToken({ email:email,reference_number:reference_number });
                            const _refreshToken = refreshToken({ email:email,reference_number:reference_number });			    
                            await getUserProfileByEmail(email,callBack => {
                                res.status(401).json({
                                    success: false,
                                    error: true,
                                    data: callBack,
                                    access_token: _accessToken,
                                    refresh_token: _refreshToken,
                                    message: "Login has failed. Email has not been verified."
                                });
                            });
			}else{
                            res.status(401).json({
                                success: false,
                                error: true,
                                message: "Login has failed."
                            });
			}
		    }
		}else{
		    res.status(400).json({
                        success: false,
                        error: true,
                        message: "Sign up using Google Sigin Option."
                    });
                }
            }else{
                res.status(404).json({
                    success: false,
                    error: true,
                    message: "Email not found."
                }); 
            }
        }catch(e){
            if(e){
		const message = e?.response?.message || e?.message || 'Something wrong has happened';    
		const payload = {
                    channel_name: 'error_log',
		    email: email,	
                    reference_number: 'None',
	            error_code: 500,		
                    error_message: `ERROR: ${message}`
		};    
		await sendMessageToQueue(MEMORY_QUEUE_NAME,JSON.stringify(payload));    
                res.status(500).json({
                    success: false,
                    error: true,
                    message: message
                });
            }
        }
    }else{
	console.error(errors.array());    
        res.status(422).json({ success: false, error: true, message: errors.array() });
    }   
};
