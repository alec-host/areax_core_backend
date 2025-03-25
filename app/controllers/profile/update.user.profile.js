const { parsePhoneNumber } = require('libphonenumber-js');
const { formatPhone } = require('../../utils/format.phone');
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getUserProfileByEmail } = require("../user/get.user.profile.by.email");
const { modifyUserByEmail } = require("../user/modify.user.by.email");
const { validationResult } = require('express-validator');

module.exports.UpdateProfile = async(req,res) => {
    const { username,email,caption,phone,country,city,reference_number } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const email_found = await findUserCountByEmail(email);
            if(email_found > 0){
                const reference_number_found = await findUserCountByReferenceNumber(reference_number);
                if(reference_number_found > 0){
                    const formattedPhone = formatPhone(phone);
                    const phoneNumber = parsePhoneNumber(formattedPhone);
                    if(phoneNumber.isValid()){
                        await modifyUserByEmail(email,{phone:formattedPhone,username,caption,country,city});
                        await getUserProfileByEmail(email,callBack => {
                            res.status(200).json({
                                success: true,
                                error: false,
                                data: callBack,
                                message: "User profile has been updated"
                            }); 
                        });
                    }else{
                        res.status(400).json({
                            success: false,
                            error: true,
                            message: "Invalid phone."
                        });                       
                    }
                }else{
                    res.status(404).json({
                        success: false,
                        error: true,
                        message: "Reference number not found."
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
                res.status(500).json({
                    success: false,
                    error: true,
                    message: e?.response?.message || 'Something wrong has happened'
                });
            }
        }
    }else{
        res.status(422).json({errors: errors.array()});
    }
};
