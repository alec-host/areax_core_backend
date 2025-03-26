const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { TikTokTokenModel } = require("../../../mongodb.models");

module.exports.tiktokTokenExistByReferenceNo = async(reference_number) => {
    try{
        const connection = await mongoDb();
        if(connection){
            const userRecord = await TikTokTokenModel.findOne({reference_number:reference_number});
            if(userRecord){
                return 1;
            }else{
                return 0;
            }
        }else{
            return 0;
        }
    }catch(err){
        console.error('Error: ',err);
        return 0;
    }finally{
        mongoose.connection.close();
    }
};
