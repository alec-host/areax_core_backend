const { validationResult } = require("express-validator");
const { sendEmailOtp } = require("../../../services/NODEMAILER");
const { generateRandomOtp } = require("../../../utils/generate.otp");
const { findUserCountByEmail } = require("../../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../../user/find.user.count.by.reference.no");
const { saveMailOtp } = require("../save.mail.otp");
const { otpWaitTimeInMinutes } = require("../otp.wait.time.model");

exports.RequestEmailOtp = async(req,res) => {
    const { email, reference_number } = req.body;
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
              error: false,
              message: 'Email not found.'
          });	       
	  return;
       }
       const reference_number_found = await findUserCountByReferenceNumber(reference_number);
       if(reference_number_found === 0){
          res.status(404).json({
              success: false,
              error: true,
              message: 'Reference number not found.'
          });
	  return;
       }
       const otpCode = generateRandomOtp();
       const waitTimeInMinutes = await otpWaitTimeInMinutes(email);
       if(waitTimeInMinutes !== null){
          const delay = JSON.stringify(waitTimeInMinutes);
	  if(JSON.parse(delay).time_in_minutes >= 1){
              const response = await sendEmailOtp(email,otpCode);
              if(!response[0]){
                 res.status(400).json({
                     success: false,
                     error: true,
                     message: response[1] || 'Invalid token'
                 });
		 return;
	      }
              await saveMailOtp({phone:0,email:email,message:response[2]});
              res.status(200).json({
                  success: true,
                  error: false,
                  message: response[1]
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
	   const response = await sendEmailOtp(email,otpCode);
           if(!response[0]){
              res.status(400).json({
                  success: false,
                  error: true,
                  message: response[1] || 'Invalid token'
              });
              return;		   
	   }

           await saveMailOtp({phone:0,email:email,message:response[2]});
           res.status(200).json({
               success: true,
               error: false,
               message: response[1]
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
