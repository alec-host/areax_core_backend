const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { deleteUserByReferenceNo } = require("../user/purge.user.by.reference.no");
const { copyUserRecordByReferenceNo } = require("../user/copy.user.record.by.reference.no");

module.exports.PurgeUser = async(req,res) => {
    const { email, reference_number } = req.body;
    const error = validationResult(req);
    if(!error.isEmpty()){
        res.status(422).json({success: false, error: true, message: errors.array()});
	return;    
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
            message: 'Email not found.'
        });
	return;
    }
    const response = copyUserRecordByReferenceNo(reference_number);
    if(response){ 
        await deleteUserByReferenceNo(reference_number);	
        res.status(200).json({
            success: true,
            error: false,
            message: 'User account has been deleted.'
        });
    }else{
        res.status(400).json({
            success: false,
            error: true,
            message: 'Account deletion has failed.'
        }); 
    }
};
