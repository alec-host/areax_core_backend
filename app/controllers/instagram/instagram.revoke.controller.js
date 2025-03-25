const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { revokeInstagramUserToken } = require('../user/instagram/store.mongo.instagram.token');
const { sendMessageToQueue } = require("../../services/RABBIT-MQ");
const { MEMORY_QUEUE_NAME } = require("../../constants/app_constants");

exports.InstagramRevoke = async(req, res) => {
    const { email, reference_number } = req.body;
    const errors = validationResult(req)
    if(errors.isEmpty()){
        const email_found = await findUserCountByEmail(email);
	if(email_found > 0){
            const reference_number_found = await findUserCountByReferenceNumber(reference_number);
            if(reference_number_found > 0){
		const payload = { reference_number }; 
		const response = await revokeInstagramUserToken(payload);
		if(response[0]){ 
                    const messageMq = {
                        channel_name: 'activity_log',
                        email: email,
                        reference_number: reference_number,
                        activity_name: `REVOKE IG ACCESS: ${response[1]}`
                    };
		    await sendMessageToQueue(MEMORY_QUEUE_NAME,JSON.stringify(messageMq));	
                    res.status(200).json({
                        success: true,
                        error: false,
                        message: response[1]
                    });
		}else{
                    const messageMq = {
                        channel_name: 'error_log',
                        email: email,
                        reference_number: reference_number,
			error_code: 400,    
                        error_message: `ERROR: Attempting to Revoke IG Access.`
                    };
                    await sendMessageToQueue(MEMORY_QUEUE_NAME,JSON.stringify(messageMq));			
                    res.status(400).json({
                        success: false,
                        error: true,
                        message: response[1]
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
