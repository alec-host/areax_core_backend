const { validationResult } = require("express-validator");
const { addSubscriptionPlanByReferenceNumber } = require("../tiers/admin.create.tiers");
const { connectToRedis, closeRedisConnection } = require("../../cache/redis");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");

module.exports.AddSubscriptionPlan = async(req,res) => {
    const { email, reference_number, tier_reference_number } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const client = await connectToRedis();
	    const payload = { tier_reference_number }; 	
	    const email_found = await findUserCountByEmail(email);
	    if(email_found > 0){ 
		const reference_number_found = await findUserCountByReferenceNumber(reference_number); 
		if(reference_number_found > 0){    
                    const response = await addSubscriptionPlanByReferenceNumber(reference_number,payload);	
                    if(response){
                        res.status(200).json({
                            success: true,
                            error: false,
                            message: "Subscription plan has been added"
                        });
                    }else{
                        res.status(400).json({
                            success: false,
                            error: true,
                            message: "Failed to add a suscription plan"
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
