const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { InstagramUserDataModel } = require("../../../mongodb.models");

module.exports.getUserInstagramProfileExistByReferenceNumber = async(reference_number) => {
    try{
        const query = { 
            reference_number:reference_number,
            is_revoked:0,
            is_deleted:0,
        };  
        const connection = await mongoDb(); 
        if(connection){
            const count = await InstagramUserDataModel.countDocuments(query);
            return count;
        }else{
            return null;
        }
    }catch(err){
        console.error('ERROR: ', err);
        return null;
    }finally{
        mongoose.connection.close();
    }
};
