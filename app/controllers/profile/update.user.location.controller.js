const axios = require('axios');
const FormData = require('form-data');
const { validationResult } = require('express-validator');
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { saveUserLocationData, modifyUserLocationiDataByReferenceNumber,getUserLocationCount,upsertUserLocationData } = require("../user/mongo.user.location.by.reference.no");

module.exports.UpdateUserLocation = async(req,res) => {
    const { email,reference_number,lat,lng } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const email_found = await findUserCountByEmail(email);
            if(email_found > 0){
                const reference_number_found = await findUserCountByReferenceNumber(reference_number);
                if(reference_number_found > 0){
	            /*		
	            let data = new FormData();
		    data.append('_id', 10000000);
                    data.append('reference_number', reference_number);
                    data.append('lat', lat);
                    data.append('lng', lng);
                    data.append('updated_at', Date.now);
		    */
		    await upsertUserLocationData({ reference_number,lat,lng });	
                    res.status(200).json({
                        success: true,
                        error: false,
                        message: "User coordinates lat,lng has been updated"
                    });
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
	        console.log(e);	    
                res.status(500).json({
                    success: false,
                    error: true,
                    message: e?.response?.message || 'Something wrong has happened'
                });
            }
        }
    }else{
        res.status(422).json({errors: errors.array()});
    }
};
