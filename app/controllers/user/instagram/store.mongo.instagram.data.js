const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { InstagramUserDataModel } = require("../../../mongodb.models");

module.exports.saveInstagramUserData = async(payload) => {
    try{
        const newInstagramUserData = new InstagramUserDataModel(payload);
        const connection = await mongoDb();
        if(connection){	
            const savedUserData = await newInstagramUserData.save();   		
            return savedUserData;
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

module.exports.modifyInstagramUserData = async(reference_number,payload) => {
    try{
        const filter = { reference_number: reference_number };
        const update = { $set: payload };
        const connection = await mongoDb();
        if(connection){
            const result = await InstagramUserDataModel.updateOne(filter, update);
            if(result.nModified === 1){
                return true;
            }else{
                return false;
            }
        }else{
            return null;
        }
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
        return null;
    }finally{
        mongoose.connection.close();
    }
};
