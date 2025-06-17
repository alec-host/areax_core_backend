const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getInstagramIdByReferenceNo } = require("../user/instagram/get.mongo.instagram.id.by.reference.no");

exports.GetInstagramUserId = async(req, res) => {
    const reference_number = req.query.reference_number;
    const email = req.query.email;

    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(422).json({ success: false, error: true, message: errors.array() });	    
    }
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
    const igId = await getInstagramIdByReferenceNo(reference_number);
    if(igId){	
        res.status(200).json({
            success: true,
            error: false,
	    user_id: igId,	
            message: 'User found'
        });
	return;    
    }
    res.status(404).json({
        success: false,
        error: true,
	user_id: null,	
        message: 'User not found'
    });
};
