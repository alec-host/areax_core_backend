const { validationResult } = require("express-validator");
const { sendWhatsAppTextMessage,initWhatsAppOtpPayload } = require("../../../services/WHATSAPP");
const { generateRandomOtp } = require("../../../utils/generate.otp");
const { isMessageAccepted } = require("../../../utils/get.whatsapp.message.status");
const { findUserCountByPhone } = require("../../user/find.user.count.by.phone");
const { findUserCountByReferenceNumber } = require("../../user/find.user.count.by.reference.no");
const { saveMailOtp } = require("../save.mail.otp");
const { otpWaitTimeInMinutes } = require("../otp.wait.time.phone.model");

exports.RequestWhatsAppOtp = async(req,res) => {
    const { phone, reference_number } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       res.status(422).json({ success:false,error:true,message:errors.array() });
       return;
    }
    try{ 
       const phone_number_found = await findUserCountByPhone(phone);
       if(phone_number_found === 0){
          res.status(404).json({
              success: false,
              error: false,
              message: 'Phone number not found.'
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
       const payload = initWhatsAppOtpPayload(otpCode,phone);	
       const waitTimeInMinutes = await otpWaitTimeInMinutes(phone);	    
       if(waitTimeInMinutes !== null){
          const delay = JSON.stringify(waitTimeInMinutes);
          if(JSON.parse(delay).time_in_minutes >= 1){
	     const response = await sendWhatsAppTextMessage(payload);	  
	     const isAccepted = isMessageAccepted(JSON.parse(response));	  
             if(!isAccepted){
                res.status(400).json({
                    success: false,
                    error: true,
                    message: 'Failed to send OTP.'
                });		
		return;
	     }
             await saveMailOtp({phone:phone,email:0,message:otpCode});
             res.status(200).json({
                 success: true,
                 error: false,
                 message: 'OTP has been sent to WhatsApp'
             });
             return;
	  }else{
             res.status(400).json({
                 success: false,
                 error: true,
                 message: 'An OTP will be sent after 1 minute.'
             });
             return;	
          }
       }else{
          const response = await sendWhatsAppTextMessage(payload);
          const isAccepted = isMessageAccepted(JSON.parse(response));
          if(!isAccepted){
             res.status(400).json({
                 success: false,
                 error: true,
                 message: 'Failed to send OTP.'
             });
             return;
          }
          res.status(200).json({
              success: true,
              error: false,
              message: 'OTP has been sent to WhatsApp'
          });
          return;	       
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
