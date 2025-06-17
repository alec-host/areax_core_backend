const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { InstagramTokenModel } = require("../../../mongodb.models");

module.exports.getInstagramAccessTokenByReferenceNo = async(reference_number) => {
    try{
        const connection = await mongoDb();
        if(connection){
            const userRecord = await InstagramTokenModel.findOne({reference_number:reference_number});
            if(userRecord){
                return userRecord.long_lived_token;
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
