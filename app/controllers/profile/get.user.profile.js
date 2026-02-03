const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getUserProfileByEmail } = require("../user/get.user.profile.by.email");
const { connectToRedis, closeRedisConnection } = require("../../cache/redis");
const { updateSingleUserProfileCache } = require("../../sync-cache-service/sync.service");

module.exports.GetProfile = async(req,res) => {
    const errors = validationResult(req);
    const email = req.query.email;
    const reference_number = req.query.reference_number;
    if(!errors.isEmpty()){
	res.status(422).json({success: false, error: true, message: errors.array()});
	return;
    }
    try{
       const email_found = await findUserCountByEmail(email);
       if(email_found === 0){
	   res.status(404).json({
               success: false,
               error: true,
               message: "Email not found."
           });
	   return;
       }
       const reference_number_found = await findUserCountByReferenceNumber(reference_number);
       if(reference_number_found === 0){
           res.status(404).json({
               success: false,
               error: true,
               message: "Reference number not found."
           });
	   return;
       }
       const client = await connectToRedis();	
       const cachedUserProfile = await client.get(`user:${email}`);
       if(cachedUserProfile){	
           res.status(200).json({
               success: true,
               error: false,
               data: JSON.parse(cachedUserProfile),
               message: "User profile"
           });
           return;    
       }
       await getUserProfileByEmail(email, async(callBack) => {
            if(callBack){    
	       await updateSingleUserProfileCache(email);   
	    }
            res.status(200).json({
                success: true,
                error: false,
                data: callBack,
                message: "User profile"
            });
       });
    }catch(e){
         if(e){
             res.status(500).json({
                 success: false,
                 error: true,
                 message: e?.response?.message || 'Something wrong has happened'
             });
         }            
    }
};
