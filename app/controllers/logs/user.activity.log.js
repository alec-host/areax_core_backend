const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { saveUserActivityData } = require("../user/activity/store.mongo.user.activity");

exports.UserActivityLogs = async(req,res) => {
    const { email,reference_number,activity_name } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            email_found = await findUserCountByEmail(email);
            if(email_found > 0){
                const reference_number_found = await findUserCountByReferenceNumber(reference_number);
                if(reference_number_found > 0){
		    const payload = { email,reference_number,activity_name };	
		    await saveUserActivityData(payload);	
                    res.status(200).json({
                        success: true,
                        error: false,
                        message: 'Message received successful.'
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
                    message: e?.message || e?.response?.message || 'Something wrong has happened'
                });
            }
        }
    }else{
        res.status(422).json({ success: false, error: true, message: errors.array()});
    }
};
