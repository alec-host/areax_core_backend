const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { tiktokApiLogin } = require("../../services/TIKTOK");
const { storeUserInstagramActivityLog } = require("../user/instagram/store.user.instagram.activity.log");
const { generateRandomHash } = require("../../utils/generate.random.hash");
const { sendMessageToQueue } = require("../../services/RABBIT-MQ");
const { MEMORY_QUEUE_NAME,RABBITMQ_QUEUE_LOGS } = require("../../constants/app_constants");

module.exports.TiktokAuthorize = async(req,res) => {	
    const { email,reference_number,client_type } = req.body;
    const errors = validationResult(req);
    const hashLength = 32;	
    const hashString = generateRandomHash(hashLength);	
    if(errors.isEmpty()){    
        const email_found = await findUserCountByEmail(email);
        if(email_found > 0){	
            const reference_number_found = await findUserCountByReferenceNumber(reference_number);
            if(reference_number_found > 0){
		const route = req.originalUrl;
                const created_at = Date.now();
                const service = "tiktok";    
		const operation_type = "authorize";
		const state = hashString;    
                const response = await tiktokApiLogin(hashString);  
		if(response[0]){
	            await storeUserInstagramActivityLog({reference_number,route,operation_type,client_type,service,state,created_at});		
		    if(client_type === "web"){	
		        res.redirect(response[1]);
         	    }else{	
			const message = "You will shortly be redirected TikTok Login page.";
		        await sendMessageToQueue(reference_number,message);    
                        res.status(200).json({
                            success: true,
                            error: false,
		            data: response[1],
                            message: message
                        }); 
		    }
		}else{
		    const payload = {
		        channel_name: 'error_log',
			email: email,    
                        reference_number: reference_number,
			error_status: 400,    
		        error_message: `ERROR: ${response[1]}`	   
		    };	
		    await sendMessageToQueue(RABBITMQ_QUEUE_LOGS,JSON.stringify(payload));	
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
