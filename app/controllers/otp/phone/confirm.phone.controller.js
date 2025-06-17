const { verifyToken } = require("../../../services/FIREBASE-OTP");
const { findUserCountByPhone } = require("../../user/find.user.count.by.phone");

exports.ConfirmPhone = async(req,res) => {
    if(Object.keys(req.body).length !== 0){
        const { idToken } = req.body;
        try{ 
            const decodedPhone = await verifyToken();
            const user_found = await findUserCountByPhone(decodedPhone);
            if(user_found === 0){
                res.status(404).json({
                    success: false,
                    error: true,
                    message: 'Phone number not found.'
                });
		return;
	    }
            if(!decodedPhone){
               res.status(400).json({
                   success: false,
                   error: true,
                   message: 'Failed to confirm the phone number.'
               });		    
	       return;	    
	    }
            res.status(200).json({
                success: true,
                error: false,
                data: data,
                message: 'The phone number has been verified.'
            });
        }catch(e){
            if(e){
                res.status(500).json({
                    success: false,
                    error: true,
                    message: e?.response?.message || e?.message || 'Something wrong has happened'
                });
            }           
        }
    }else{
        res.status(400).json({
            success: false,
            error: true,
            message: "Missing: Request payload not provided."
        }); 
    }
};
