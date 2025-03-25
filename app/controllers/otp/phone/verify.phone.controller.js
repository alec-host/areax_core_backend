const { parsePhoneNumber } = require('libphonenumber-js');
const { formatPhone } = require('../../../utils/format.phone');
const { findUserCountByEmail } = require("../../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../../user/find.user.count.by.reference.no");
const { modifyUserByEmail } = require("../../user/modify.user.by.email");
const { validationResult } = require('express-validator');

exports.VerifyPhone = async(req,res) => {
    const { phone,email,reference_number } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const email_found = await findUserCountByEmail(email);
            const formattedPhone = formatPhone(phone);
            const phoneNumber = parsePhoneNumber(formattedPhone);
            if(phoneNumber.isValid()){
                if(email_found > 0){
                    const reference_number_found = await findUserCountByReferenceNumber(reference_number);
                    if(reference_number_found > 0){
                        await modifyUserByEmail(email,{phone:phone,phone_verified:1});
                        res.status(200).json({
                            success: true,
                            error: false,
                            data: [],
                            message: 'The phone number has been verified.'
                        });
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
            }else{
                res.status(400).json({
                    success: false,
                    error: true,
                    message: 'Invalid phone number.'
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
        res.status(422).json({ success:true,error:false,message:errors.array() });
    }
};
