const { parsePhoneNumber } = require('libphonenumber-js');
const { sendVerificationToken } = require("../../../services/FIREBASE-OTP");
const { findUserCountByEmail } = require("../../user/find.user.count.by.email");
const { modifyUserByEmail } = require("../../user/modify.user.by.email");
const { formatPhone } = require('../../../utils/format.phone');
const { validationResult } = require('express-validator');
const { findUserCountByReferenceNumber } = require('../../user/find.user.count.by.reference.no');

exports.AddPhone = async(req,res) => {
    const { email,phone,reference_number } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({success: false, error: true, message: errors.array()});
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
       const formattedPhone = formatPhone(phone);
       const phoneNumber = parsePhoneNumber(formattedPhone);
       if(!phoneNumber.isValid()){
          res.status(400).json({
              success: false,
              error: true,
              message: "Invalid phone."
          });
	  return;
       }
       const response = await sendVerificationToken(phone);
       if(!response[0]){
          res.status(400).json({
              success: false,
              error: true,
               message: "Invalid phone."
          });	       
	  return;     
       }
       await modifyUserByEmail(email,{phone:phone});
       res.status(200).json({
           success: true,
           error: false,
           verificationToken: response[1],
           message: response[2]
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
