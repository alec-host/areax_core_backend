const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { SystemErrorsModel } = require("../../../mongodb.models");

module.exports.saveSystemErrors = async(payload) => {
    try{
        const newSystemErrorsData = new SystemErrorsModel(payload);
        const connection = await mongoDb();
        if(connection){
            const savedUserData = await newSystemErrorsData.save();
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
