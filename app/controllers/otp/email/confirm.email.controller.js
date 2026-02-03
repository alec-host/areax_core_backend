const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../../user/find.user.count.by.reference.no");
const { modifyUserByEmail } = require("../../user/modify.user.by.email");
const { confirmMailOtp } = require("../../otp/confirm.mail.otp");
const { confirmRefereeEmail } = require('../../user/process.referral.code');
const { purgeOtp } = require("../../otp/purge.mail.otp");
const { postReferralDataForWeePointReward } = require("../../../utils/post.wee.points");

exports.ConfirmEmail = async(req,res) => {
    const { email, reference_number, otp } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       res.status(422).json({ success:false,error:true,message:errors.array() });
       return;
    }
    try{ 
       const email_found = await findUserCountByEmail(email);
       if(email_found === 0){
           res.status(400).json({
               success: false,
               error: true,
               message: "Email not found."
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
       const hasOtpMatched = await confirmMailOtp(otp,email);
       if(!hasOtpMatched){
          res.status(400).json({
              success: false,
              error: true,
              message: 'Invalid OTP.'
          });	       
          return;
       }
       await purgeOtp(email);
       await modifyUserByEmail(email,{email_verified:1});	    
       const [ ok, referraldata ] = await confirmRefereeEmail(email,reference_number);	     
       if(ok){
	  const referrer_email = referraldata.referrer_email;
	  const referee_email = referraldata.referee_email;     
	  const resp = await postReferralDataForWeePointReward({ referrer_email, referee_email });    
	  console.log(resp);     
       }	    
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
