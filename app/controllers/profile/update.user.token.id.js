const { encrypt } = require("../../services/CRYPTO");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getUserProfileByEmail } = require("../user/get.user.profile.by.email");
const { getUserTokenIdByEmail } = require("../user/get.user.token.id.by.email");
const { modifyUserByEmail } = require("../user/modify.user.by.email");
const { validationResult } = require('express-validator');

module.exports.UpdateTokenId = async(req,res) => {
    const { email,reference_number,token_id } = req.body;
    const errors = validationResult(req);
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
	const isTokenIdSet = await getUserTokenIdByEmail(email);
        if(isTokenIdSet.hashed_token_id){
	   await getUserProfileByEmail(email,callBack => {    
               res.status(400).json({
                   success: false,
                   error: true,
	           data: callBack,	
                   message: "Token ID is already set."
               });
	   });		
        }else{
	   if(token_id.trim().length > 0){    
	       const hashed_token_id = await encrypt(token_id);    
	       console.log('TOKEN ID', token_id);   
	       console.log('ENCRYPT ', hashed_token_id);    
               await modifyUserByEmail(email,{ token_id, hashed_token_id });
               await getUserProfileByEmail(email,callBack => {
                   res.status(200).json({
                       success: true,
                       error: false,
                       data: callBack,
                       message: "Token ID has been updated."
                   }); 
               });
	   }else{
               res.status(400).json({
                   success: false,
                   error: true,
                   data: [],
                   message: "Token ID needs to be checked."
               });
	   }
	}
    }catch(e){
       if(e){
           res.status(500).json({
               success: false,
               error: true,
               message: e?.response?.message || e?.message || 'Something wrong has happened'
           });
       }
    }
};
