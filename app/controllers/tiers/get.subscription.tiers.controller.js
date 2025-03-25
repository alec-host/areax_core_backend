const { validationResult } = require("express-validator");
const { getSubscriptionTiersByReferenceNumber } = require("../tiers/admin.create.tiers");
const { connectToRedis, closeRedisConnection } = require("../../cache/redis");

module.exports.GetSubscriptionTiers = async(req,res) => {
    const { user } = req.query;
    const errors = validationResult(req);
    if(!user || user.toLowerCase().trim() !== 'admin'){
         return res.status(400).json({  success: false, error: true, message: "Invalid user provided." });
    } 	
    if(errors.isEmpty()){
        try{
	    const client = await connectToRedis();	
	    if(client){	
                //const cacheDate = await client.get("admin_tiers");
		const cacheDate = null;
		if(cacheDate){
                    res.status(200).json({
                        success: true,
                        error: false,
                        data: JSON.parse(cacheDate),
                        message: "List of subscription tiers."
                    });
		}else{    
                    await getSubscriptionTiersByReferenceNumber(async(callBack) => {
	                if(callBack){	
			     await client.set("admin_tiers",JSON.stringify(callBack));	
                             res.status(200).json({
                                 success: true,
                                 error: false,
                                 data: callBack,
                                 message: "List of subscription tiers."
                             });
		        }else{
                             res.status(404).json({
                                 success: false,
                                 error: true,
				 data: [],
                                 message: `Record not found`
                             });
		        }
                    });
                    await closeRedisConnection(client);			    
		}
	   }
        }catch(error){
            if(error){
                res.status(500).json({
                    success: false,
                    error: true,
                    message: error?.message || 'Something wrong has happened'
                });
            }
        }
    }else{
        res.status(422).json({ success: false, error: true, message: errors.array()});
    }
};
