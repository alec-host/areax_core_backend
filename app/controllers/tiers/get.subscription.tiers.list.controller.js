const { validationResult } = require("express-validator");
const { getSubscriptionTiersByReferenceNumber } = require("../tiers/admin.create.tiers");
const { connectToRedis, closeRedisConnection } = require("../../cache/redis");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");

module.exports.GetSubscriptionPlanList = async(req,res) => {
    const { email,reference_number } = req.query;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{	    
            const client = await connectToRedis();
            const email_found = await findUserCountByEmail(email);
	    if(email_found > 0){	
		const reference_number_found = await findUserCountByReferenceNumber(reference_number);
		if(reference_number_found > 0){	
                     if(client){
                          const cacheData = await client.get("admin_tiers");
			  const mCachedData = JSON.parse(cacheData);
			  const filteredCachedData = mCachedData.filter(item => item.is_deleted === 0);  
                          if(cacheData){
                               res.status(200).json({
                                   success: true,
                                   error: false,
                                   data: filteredCachedData,
                                   message: "List of subscription plan."
                               });
                          }else{
                               await getSubscriptionTiersByReferenceNumber(async(callBack) => {
                                   if(callBack){
                                       await client.set("admin_tiers",JSON.stringify(callBack));
				       const mCallBack = JSON.parse(callBack);
				       const filteredCallBack = mCallBack.filter(item => item.is_deleted === 0);	   
                                       res.status(200).json({
                                           success: true,
                                           error: false,
                                           data: filteredCallBack,
                                           message: "List of subscription plan."
                                       });
                                   }else{
                                       res.status(404).json({
                                           success: false,
                                           error: true,
                                           data: [],
                                           message: "No record found."
                                       });
                                    } 
                               });
                               await closeRedisConnection(client);
                          } 
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
