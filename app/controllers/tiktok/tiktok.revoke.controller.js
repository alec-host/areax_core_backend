const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { deleteTiktokUserToken } = require("../user/tiktok/delete.mongo.tiktok.token");
const { deleteTiktokProfileData } = require("../user/tiktok/delete.mongo.tiktok.profile.data");
const { sendMessageToQueue } = require("../../services/RABBIT-MQ");
const { MEMORY_QUEUE_NAME } = require("../../constants/app_constants");

exports.TiktokRevoke = async(req, res) => {
    const { email, reference_number } = req.body;
    const errors = validationResult(req)
    if(errors.isEmpty()){
        const email_found = await findUserCountByEmail(email);
        if(email_found > 0){
            const reference_number_found = await findUserCountByReferenceNumber(reference_number);
            if(reference_number_found > 0){
                const payload = { reference_number };
                const response_1 = await deleteTiktokUserToken(payload);
		const response_2 = await deleteTiktokProfileData(payload);    
                if(response_1 && response_2){	
                    const messageMq = {
                        channel_name: 'activity_log',
                        email: email,
                        reference_number: reference_number,
                        activity_name: `REVOKE TIKTOK ACCESS: This was successful`
                    };
                    await sendMessageToQueue(MEMORY_QUEUE_NAME,JSON.stringify(messageMq));
                    res.status(200).json({
                        success: true,
                        error: false,
                        message: 'TikTok access has been Revoked.'
                    });
                }else{
                    const messageMq = {
                        channel_name: 'error_log',
                        email: email,
                        reference_number: reference_number,
                        error_code: 400,
                        error_message: `ERROR: Attempting to Revoke TikTok Access.`
                    };
                    await sendMessageToQueue(MEMORY_QUEUE_NAME,JSON.stringify(messageMq));
                    res.status(400).json({
                        success: false,
                        error: true,
                        message: "ERROR: Attempting to Revoke TikTok Access."
                    });
                }
            }else{
                res.status(404).json({
                    success: false,
                    error: true,
                    message: "Reference Number not found"
                });
            }
        }else{
            res.status(404).json({
                success: false,
                error: true,
                message: "Email not found"
            });
        }

    }else{
        res.status(422).json({ success: false, error: true, message: errors.array() });
    }
};
