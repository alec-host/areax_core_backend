const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { UserActivitiesModel } = require("../../../mongodb.models");

module.exports.saveUserActivityData = async(payload) => {
    try{
        const newUserActivityData = new UserActivitiesModel(payload);
        const connection = await mongoDb();
        if(connection){
            const savedUserData = await newUserActivityData.save();
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
