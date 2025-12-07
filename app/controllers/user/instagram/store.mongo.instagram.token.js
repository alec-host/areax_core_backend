const mongoose = require("mongoose");

const { InstagramTokenModel,InstagramUserDataModel } = require("../../../mongodb.models");

module.exports.saveInstagramUserToken = async(payload) => {
    try{
        const newInstagramToken = new InstagramTokenModel(payload);
      
        const savedToken = await newInstagramToken.save();
        return savedToken;
    }catch(err){
        console.error('Error: failed to insert or update. ',err.message);
        return null;
    }
};

module.exports.updateInstagramUserToken = async(reference_number,payload) => {
    try{
        const filter = { reference_number: reference_number };
        const update = { $set: payload}
       
        const result = await InstagramTokenModel.updateOne(filter, update, { upsert: true });
        return result.modifiedCount === 1 || result.upsertedCount === 1;
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
        return null;
    }
};

module.exports.revokeInstagramUserToken = async(payload) => {
    try{
        const deleteTokenResult = await InstagramTokenModel.deleteOne(payload);		
        const deleteUserDataResult = await InstagramUserDataModel.deleteOne(payload);
	
	return [true, 'Instagram access has been revoked'];
    }catch(err){
	await session.abortTransaction();
	session.endSession();    
        console.error('Error: failed to delete. ',err);

        return [false,'Error: failed to delete'];
    }
};
