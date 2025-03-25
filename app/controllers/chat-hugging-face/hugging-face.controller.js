const { huggingFaceClient } = require('../../services/HUGGING-FACE');
const { findUserCountByEmail } = require('../user/find.user.count.by.email');
const { findUserCountByReferenceNumber } = require('../user/find.user.count.by.reference.no');

exports.ChatHuggingFace = async(req,res) => {
    const { validationResult } = require('express-validator');
    const { user_message,email,reference_number } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const email_found = await findUserCountByEmail(email);
            if(email_found > 0){
                const reference_number_found = await findUserCountByReferenceNumber(reference_number);
                if(reference_number_found > 0){
		    console.log('BEFORE passing user message.');	
                    const response = await huggingFaceClient(user_message);
		    console.log('AFTER passing user message.',response);	
		    if(response[0]){	
                    	res.status(200).json({
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
                }else{
                    res.status(404).json({
                        success: false,
                        error: true,
                        message: "Reference number not found."
                    });                     
                }
            }else{
                res.status(404).json({
                    success: false,
                    error: true,
                    message: "Email not found."
                });                 
            }
        }catch(e){
            if(e){
                res.status(400).json({
                    success: false,
                    error: true,
                    message: "Something wrong has happened." 
                });
            } 
        }
    }else{
        res.status(422).json({errors: errors.array()});
    }
};
