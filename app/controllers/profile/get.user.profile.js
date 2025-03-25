const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getUserProfileByEmail } = require("../user/get.user.profile.by.email");
module.exports.GetProfile = async(req,res) => {
    const errors = validationResult(req);
    const email = req.query.email;
    const reference_number = req.query.reference_number;
    if(errors.isEmpty()){
        try{
            const email_found = await findUserCountByEmail(email);
            if(email_found > 0){
                const reference_number_found = await findUserCountByReferenceNumber(reference_number);
                if(reference_number_found > 0){
                    await getUserProfileByEmail(email,callBack => {
                        res.status(200).json({
                            success: true,
                            error: false,
                            data: callBack,
                            message: "User profile"
                        }); 
                    }); 
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