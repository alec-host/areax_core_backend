const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { validationResult } = require("express-validator");
const { getUserAcessTokenByEmail } = require("../user/get.user.access.token.by.email");
const { getUserSignedInStatusCountByEmail } = require("../user/get.user.signed.in.status.by.email");

exports.SignedInStatus = async(req,res) => {
    const { email,reference_number } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
	res.status(422).json({ success: false, error: true, message: errors.array() });    
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
        const signed_in_status = await getUserSignedInStatusCountByEmail(email);
        if(signed_in_status === 1){
	    const access_token = await getUserAcessTokenByEmail(email);
            res.status(200).json({
                success: true,
                error: false,
	        data: [{access_token: access_token,reference_number: reference_number}], 			
                message: "User is logged in."
            }); 
        }else{
            res.status(400).json({
                success: false,
                error: true,
		data:[],		
                message: "User is not logged in."
            });                
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
