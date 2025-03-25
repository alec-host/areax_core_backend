const { validationResult } = require("express-validator");
const { readMessageFromQueue } = require("../../services/RABBIT-MQ");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");

exports.ReadMQMessage = async(req,res) => {
    const { email, reference_number } = req.query;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            email_found = await findUserCountByEmail(email);
            if(email_found > 0){
                const reference_number_count  = await findUserCountByReferenceNumber(reference_number);
                if(reference_number_count > 0){
	            readMessageFromQueue(reference_number)
			.then((message) => {
			    if(message){
                                res.status(200).json({
                                    success: true,
                                    error: false,
                                    message: message
                                });
			    }else{
                                res.status(404).json({
                                    success: false,
                                    error: true,
                                    message: 'No message found.'
                                });
			    }
			})
			.catch((error) => {
                            res.status(400).json({
                                success: false,
                                error: true,
                                message: error
                            });
			})
                }else{
                    res.status(404).json({
                        success: false,
                        error: true,
                        message: 'Reference Number not found.'
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
                res.status(500).json({
                    success: false,
                    error: true,
                    message: e?.response?.message || e?.response || 'Something wrong has happened'
                });
            }
        }
    }else{
        res.status(422).json({ success: false, error: true, message: errors.array() });
    }
};
