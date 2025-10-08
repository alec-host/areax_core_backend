const { validationResult } = require("express-validator");
const { sendEmailOtp,sendGridEmailOtp } = require("../../../services/NODEMAILER");
const { generateRandomOtp } = require("../../../utils/generate.otp");
const { findUserCountByEmail } = require("../../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../../user/find.user.count.by.reference.no");
const { saveMailOtp } = require("../save.mail.otp");
const { otpWaitTimeInMinutes } = require("../otp.wait.time.model");
const { getUserProfileByEmail } = require("../../user/get.user.profile.by.email");
const { accessToken, refreshToken } = require("../../../services/JWT");

exports.ForgetPasswordEmailOtp = async(req,res) => {
    const { email, handshake_value } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({ success:false,error:true,message:errors.array() });
	return;
    }
    try{
       const email_found = await findUserCountByEmail(email);
       if(email_found === 0){
           res.status(404).json({
               success: false,
               error: true,
                message: 'Email not found.'
           });
	   return;
       }
       const otpCode = generateRandomOtp();   
       const _accessToken = accessToken({ email:email});
       const _refreshToken = refreshToken({ email:email });    
       const waitTimeInMinutes = await otpWaitTimeInMinutes(email);
       if(waitTimeInMinutes !== null){
           const delay = JSON.stringify(waitTimeInMinutes);
           if(JSON.parse(delay).time_in_minutes >= 1){
              const response = await sendGridEmailOtp(email,otpCode);
              if(!response[0]){
                  res.status(400).json({
                      success: false,
                      error: true,
                      message: response[1] || 'Invalid token'
                  });
		  return;
	      }
              await saveMailOtp({phone:0,email:email,message:response[2]});
              await getUserProfileByEmail(email,profileCallback => {
                  res.status(200).json({
                      success: true,
                      error: false,
                      data: profileCallback,
                      access_token: _accessToken,
                      refresh_token: _refreshToken,
                      message: response[1]
                  });
              });
           }else{
              res.status(400).json({
                  success: false,
                  error: true,
                  message: 'An OTP will be sent after 1 minute.'
              });
              return;    
	   }	 
       }else{
	   const response = await sendGridEmailOtp(email,otpCode);
           if(!response[0]){
               res.status(400).json({
                   success: false,
                   error: true,
                   message: response[1] || 'Invalid token'
               });
               return;
	   }
           await saveMailOtp({phone:0,email:email,message:response[2]});
           await getUserProfileByEmail(email,profileCallback => {
               res.status(200).json({
                   success: true,
                   error: false,
                   data: profileCallback,
                   access_token: _accessToken,
                   refresh_token: _refreshToken,
                   message: response[1]
               });
           });
       }
    }catch(e){
        if(e){
            res.status(500).json({
                success: false,
                error: true,
                message: e?.response?.message || e?.message || 'Something wrong has happened'
            });
        }
    }
};
