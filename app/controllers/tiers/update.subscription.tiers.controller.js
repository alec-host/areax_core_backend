const { validationResult } = require("express-validator");
const { connectToRedis, closeRedisConnection } = require("../../cache/redis");
const { updateSubscriptionTiersByReferenceNumber, getSubscriptionTierByReferenceNumber } = require("../tiers/admin.create.tiers");

module.exports.UpdateSubscriptionTiers = async(req,res) => {
    const { reference_number, name, monthly_cost, yearly_cost, campaign_specific_price, entry, benefits, credits_per_action } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
	    const client = await connectToRedis();
            const payload = { name, monthly_cost, yearly_cost, campaign_specific_price, entry, benefits, credits_per_action };
            const response = await updateSubscriptionTiersByReferenceNumber(reference_number,payload); 	
            if(response){
                if(client){
                    await client.del("admin_tiers");
                    await closeRedisConnection(client);
                }		   
		await getSubscriptionTierByReferenceNumber(reference_number,callBack => {    
                    res.status(200).json({
                        success: true,
                        error: false,
		        data: callBack,	
                        message: "Subscription Plan has been Updated."
                    });
		});
            }else{
                res.status(400).json({
                    success: false,
                    error: true,
	            data: [],
                    message: "Failed to update."
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
        res.status(422).json({ success: false, error: true, message: errors.array() });
    }
};
