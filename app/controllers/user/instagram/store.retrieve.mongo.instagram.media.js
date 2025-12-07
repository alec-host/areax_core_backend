const mongoose = require("mongoose");
const { InstagramMediaModel } = require("../../../mongodb.models");

module.exports.saveInstagramMediaRecord = async(payload) => {
    try{
        const newInstagramMediaData = new InstagramMediaModel(payload); 
        const savedMediaData = await newInstagramMediaData.save();
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

module.exports.retrieveInstagramMediaByReferenceNumber = async(reference_number) => {
    try{
        const records = await InstagramMediaModel.find({ reference_numbeir: reference_number, is_deleted: 0 })
	                       .select('reference_number id user_id media_type media_url caption permalink like_count comments_count is_minted created_at is_deleted')
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
