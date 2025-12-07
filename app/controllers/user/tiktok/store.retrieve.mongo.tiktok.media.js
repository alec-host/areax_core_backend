const mongoose = require("mongoose");

const { TikTokMediaModel } = require("../../../mongodb.models");

module.exports.saveTiktokMediaRecord = async(payload) => {
    try{
        const newTiktokMediaData = new TikTokMediaModel(payload);
        
        const savedMediaData = await newTiktokMediaData.save();
        if(savedMediaData){		
           return savedMediaData;
        }else{
           console.log('Connection to db has failed');
           return null;
        }
    }catch(err){
        console.error('Error: failed to insert or update. ',err.message);
        return null;
    }
};

module.exports.retrieveTiktokMediaByReferenceNumber = async(reference_number) => {
    try{
        const records = await TikTokMediaModel.find({ reference_number: reference_number, is_deleted: 0 })
              .select('reference_number user_id publish_id upload_url title caption like_count comments_count is_minted created_at is_deleted')
              .sort({ created_at: -1 })
              .limit(500);
        if(records){	       
           return records;
        }else{
           console.log('Connection to db has failed');
           return null;
        }
    }catch(err){
        console.error('Error: failed to retrieve records. ',err);
        return null;
    }
};
