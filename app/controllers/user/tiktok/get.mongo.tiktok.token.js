const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { TikTokTokenModel } = require("../../../mongodb.models");

module.exports.getTikTikAccessTokenByReferenceNumber = async(reference_number) => {
    try{
       const connection = await mongoDb();
       if(connection){
            const records = await TikTokTokenModel.findOne({ reference_number: reference_number }).select({ access_token:1,refresh_token:1,_id:0 });
            return records;
       }else{
            console.log('Connection to db has failed');
            return null;
       }
    }catch(err){
        console.error('Error: failed to retrieve records. ',err);
        return null;
    }finally{
        mongoose.connection.close();
    }
};
