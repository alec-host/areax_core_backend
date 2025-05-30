const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { InstagramUserDataModel } = require("../../../mongodb.models");

module.exports.getInstagramIdByReferenceNo = async(reference_number) => {
    try{
        const connection = await mongoDb();
        if(connection){
            const userRecord = await InstagramUserDataModel.findOne({reference_number:reference_number});
            if(userRecord){
                return userRecord.user_id;
            }else{
                return null;
            }
        }else{
            return null;
        }
    }catch(err){
        console.error('Error: ',err);
        return null;
    }finally{
        mongoose.connection.close();
    }
};
