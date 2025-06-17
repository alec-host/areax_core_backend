const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getUserInstagramProfileByReferenceNo } = require("../user/instagram/get.mongo.instagram.profile.by.reference.no");

module.exports.GetInstagramProfileStats = async(req, res) => {
    const { email,reference_number } = req.query;
    const errors = validationResult(req);	
    if(!errors.isEmpty()){
       return res.status(422).json({ success: false, error: true, message: errors.array() });
    }
    try{ 		
        const email_found = await findUserCountByEmail(email);
        if(email_found === 0){
            res.status(404).json({
                success: false,
                error: true,
                message: 'Email not found.'
            });
	    return;	
	}
        const reference_number_found = await findUserCountByReferenceNumber(reference_number);
        if(reference_number_found === 0){	
           res.status(404).json({
               success: false,
               error: true,
               message: 'Reference number not found.'
           }); 
           return;
	}
        const igStats = await getUserInstagramProfileByReferenceNo(reference_number);	    
        if(igStats){
           res.status(200).json({
               success: true,
               error: false,
               data: igStats,
               message: 'Instagram profile stats information.'
           });
           return;		
        }
        res.status(404).json({
            success: false,
            error: true,
            data: null,
            message: 'Instagram profile stat not found.'
        });
    }catch(error){
        res.status(500).json({
            success: false,
            error: true,
            message: error?.response?.message || error?.message || 'Something wrong has happened.'
        });	    
    }
};
