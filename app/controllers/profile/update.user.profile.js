const { parsePhoneNumber } = require('libphonenumber-js');
const { formatPhone } = require('../../utils/format.phone');
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getUserProfileByEmail } = require("../user/get.user.profile.by.email");
const { modifyUserByEmail } = require("../user/modify.user.by.email");
const { validationResult } = require('express-validator');

module.exports.UpdateProfile = async(req,res) => {
    const { email,reference_number,username,caption,phone,country_code,country,city,privacy_status } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({ success: false, error: true, message: errors.array()});	    
	return;
    }
    try{
       const email_found = await findUserCountByEmail(email);
       if(email_found === 0){
           res.status(404).json({
               success: false,
               error: true,
               message: "Email not found."
           });
	   return;    
       }
       const reference_number_found = await findUserCountByReferenceNumber(reference_number);
       if(reference_number_found === 0){
          res.status(404).json({
              success: false,
              error: true,
              message: "Reference number not found."
          });
	  return;
       }
       const formattedPhone = formatPhone(phone);
       const phoneNumber = parsePhoneNumber(formattedPhone);
       if(phoneNumber.isValid()){
          res.status(400).json({
              success: false,
              error: true,
              message: "Invalid phone."
          });	       
          return;
       }
       await modifyUserByEmail(email,{ phone:formattedPhone,country_code,username,caption,country,city,privacy_status });
       await getUserProfileByEmail(email,callBack => {
           res.status(200).json({
               success: true,
               error: false,
               data: callBack,
               message: "User profile has been updated"
           }); 
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
