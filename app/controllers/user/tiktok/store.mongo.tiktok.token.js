const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { TikTokTokenModel } = require("../../../mongodb.models");

module.exports.saveTikTokUserToken = async(payload) => {
    try{
	const connection = await mongoDb();
	const filter = { reference_number: payload.reference_number };
	const update = {
            reference_number: payload.reference_number,
	    access_token: payload.access_token,
	    refresh_token: payload.refresh_token,
	    open_id: payload.open_id,
	    scope: payload.scope,
            expires_in: payload.expires_in
	};
        if(connection){
            const options = { new: true, upsert: true };
	    const result = await TikTokTokenModel.findOneAndUpdate(filter, update, options);
            return result;
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
