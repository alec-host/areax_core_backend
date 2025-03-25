const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { InstagramUserDataModel } = require("../../../mongodb.models");

module.exports.deleteInstagramProfileData = async(reference_number) => {
    try{
        const connection = await mongoDb();
        if(connection){
            const condition = { reference_number: reference_number };
            const result = await InstagramUserDataModel.deleteOne(condition);
            if(result.deletedCount === 1){
                return true;
            }else{
                return false;
            }
        }else{
            console.log('Connection to db has failed');
            return false;
        }
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
        return false;
    }finally{
        mongoose.connection.close();
    }
};
