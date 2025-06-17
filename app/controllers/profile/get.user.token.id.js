const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getUserTokenIdByEmail } = require("../user/get.user.token.id.by.email");
module.exports.GetUserTokenID = async(req,res) => {
    const errors = validationResult(req);
    const email = req.query.email;
    const reference_number = req.query.reference_number;
    if(!errors.isEmpty()){
        res.status(422).json({success: false,error: true,message: errors.array()});	    
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
       const get_token = await getUserTokenIdByEmail(email);
       if(get_token.token_id){ 
	   res.status(200).json({
               success: true,
               error: false,
               data: { token_id: get_token.token_id, hashed_token_id: get_token.hashed_token_id },
               message: "Token ID information."
           });
       }else{
           res.status(404).json({
               success: false,
               error: true,
               data: { token_id: null, hashed_token_id: null },
               message: "Token ID information has not been Set."
           });
       }
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
