const mongoose = require("mongoose");

const { InstagramUserDataModel } = require("../../../mongodb.models");

module.exports.saveInstagramUserData = async(payload) => {
    try{
        const newInstagramUserData = new InstagramUserDataModel(payload);
      
        const savedUserData = await newInstagramUserData.save();   		
        return savedUserData;
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
        return null;
    }
};

module.exports.modifyInstagramUserData = async(reference_number,payload) => {
    try{
        const filter = { reference_number: reference_number };
        const update = { $set: payload };
      
        const result = await InstagramUserDataModel.updateOne(filter, update, { upsert: true });
        return result.modifiedCount === 1 || result.upsertedCount === 1;
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
        return null;
    }
};
