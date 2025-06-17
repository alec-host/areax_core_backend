const { validationResult } = require("express-validator");
const { findUserCountByPhone } = require("../../user/find.user.count.by.phone");
const { findUserCountByReferenceNumber } = require("../../user/find.user.count.by.reference.no");
const { modifyUserByPhone } = require("../../user/modify.user.by.phone");
const { confirmPhoneOtp } = require("../../otp/confirm.phone.otp");
const { purgeOtp } = require("../../otp/purge.phone.otp");

exports.ConfirmWhatsAppPhoneNumber = async(req,res) => {
    const { phone, reference_number, otp } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       res.status(422).json({ success:false,error:true,message:errors.array() });
       return;
    }
    try{ 
       const phone_number_found = await findUserCountByPhone(phone);
       if(phone_number_found === 0){
          res.status(400).json({
              success: false,
              error: true,
              message: "Phone number not found."
          });	       
	  return;
       }
       const reference_number_found = await findUserCountByReferenceNumber(reference_number);
       if(reference_number_found === 0){
          res.status(400).json({
              success: false,
              error: true,
              message: "Reference number not found."
          });
	  return;
       }
       const hasOtpMatched = await confirmPhoneOtp(otp,phone);	
       if(!hasOtpMatched){
          res.status(400).json({
              success: false,
              error: true,
              message: 'Invalid OTP.'
          });	       
	  return;     
       }
       await purgeOtp(phone);
       await modifyUserByPhone(phone,{phone_verified:1});
       res.status(200).json({
           success: true,
           error: false,
           message: 'OTP confirmed.'
       });
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
