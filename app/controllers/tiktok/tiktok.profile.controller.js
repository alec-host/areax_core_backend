const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { retrieveTikTokProfileByReferenceNumber } = require("../user/tiktok/retrieve.mongo.tiktok.profile");

module.exports.GetTiktokProfile = async(req,res) => {
    const { email,reference_number } = req.query;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        const email_found = await findUserCountByEmail(email);
        if(email_found > 0){
            const reference_number_found = await findUserCountByReferenceNumber(reference_number);
            if(reference_number_found > 0){
		const result = await retrieveTikTokProfileByReferenceNumber(reference_number);  
		if(result){    
                    res.status(200).json({
                        success: true,
                        error: false,
                        data: result,
                        message: "TikTok profile information"
                    }); 
		}else{
                    res.status(404).json({
                        success: false,
                        error: true,
                        message: "No profile information."
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
    }else{
        res.status(422).json({ success: false, error: true, message: errors.array() });
    }
};
