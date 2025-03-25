const mongoose = require("mongoose");
const { mongoDb } = require("../../db/mongo.db");
const { UserLocationModel } = require("../../mongodb.models");

module.exports.upsertUserLocationData = async(payload) => {
    try{
	const connection = await mongoDb();    
	const filter = { reference_number: payload.reference_number };
	const update = {
	    lat: payload.lat,
	    lng: payload.lng	
	}    
	if(connection){
	    const options = { new: true, upsert: true };
	    const result = await UserLocationModel.findOneAndUpdate(filter, update, options);	
	}else{
            console.log('Connection to db has failed');
            return null;
	}
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
        return null;	
    }finally{
        mongoose.connection.close();
    }
};
