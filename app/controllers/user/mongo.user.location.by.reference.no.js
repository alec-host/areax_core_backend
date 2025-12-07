const mongoose = require("mongoose");

const { UserLocationModel } = require("../../mongodb.models");

module.exports.upsertUserLocationData = async(payload) => {
    try{ 
	const filter = { reference_number: payload.reference_number };
	const update = {
	    lat: payload.lat,
	    lng: payload.lng	
	}    

	const options = { new: true, upsert: true };
	const result = await UserLocationModel.findOneAndUpdate(filter, update, options);	
        if(result){		
           return result;		
	}else{
           console.log('Connection to db has failed');
           return null;
	}
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
        return null;	
    }
};
