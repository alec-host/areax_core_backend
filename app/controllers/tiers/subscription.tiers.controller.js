const { v4:uuidv4 } = require('uuid');
const { validationResult } = require("express-validator");
const { createSubscriptionTiers } = require("../tiers/admin.create.tiers");
const { connectToRedis, closeRedisConnection } = require("../../cache/redis");

module.exports.CreateSubscriptionTiers = async(req,res) => {
    const { name, monthly_cost, yearly_cost, campaign_specific_price, entry, benefits, credits_per_action } = req.body;	
    const errors = validationResult(req);
    if(errors.isEmpty()){	
        try{
	    const reference_number = uuidv4();
	    const client = await connectToRedis();	
	    const payload = { reference_number, name, monthly_cost, yearly_cost, campaign_specific_price, entry, benefits, credits_per_action }; 	
            const response = await createSubscriptionTiers(payload);   
            if(response[0]){
		if(client){
                    await client.del("admin_tiers");
		    await closeRedisConnection(client);	
		}    
                res.status(201).json({
                    success: true,
                    error: false,
                    message: response[1]
                });
	    }else{
                res.status(400).json({
                    success: false,
                    error: true,
                    message: response[1]
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
        res.status(422).json({ success: false, error: true, errors: errors.array() });
    }
};
