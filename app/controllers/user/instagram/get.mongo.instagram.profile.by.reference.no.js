const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { InstagramUserDataModel } = require("../../../mongodb.models");

module.exports.getUserInstagramProfileByReferenceNo = async(reference_number) => {
    try{
        const connection = await mongoDb();
        if(connection){
            const user = await InstagramUserDataModel.findOne({reference_number:reference_number}, 'name username account_type profile_picture_url followers_count follows_count media_count');
            return user;
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
