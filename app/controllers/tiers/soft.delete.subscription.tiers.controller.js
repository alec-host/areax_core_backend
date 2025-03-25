const { validationResult } = require("express-validator");
const { deleteSubscriptionTiersByReferenceNumber } = require("../tiers/admin.create.tiers");
const { connectToRedis, closeRedisConnection } = require("../../cache/redis");
module.exports.SoftDeleteSubscriptionTiers = async(req,res) => {
    const { reference_number } = req.params;
    const errors = validationResult(req);
    if(!reference_number){
	return res.status(400).json({ success: false, error: true, message: "reference_number has to be checked."});
    }	
    if(errors.isEmpty()){
        try{
            const client = await connectToRedis();
	    const referenceId = `${reference_number}`;
            const response = await deleteSubscriptionTiersByReferenceNumber(referenceId);		
            if(response){
                if(client){
                    await client.del("admin_tiers");
                    await closeRedisConnection(client);
                }
                res.status(200).json({
                    success: true,
                    error: false,
                    message: "Subscription tier has been deleted"
                });
            }else{
                res.status(400).json({
                    success: false,
                    error: true,
                    message: "Soft delete has failed"
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
