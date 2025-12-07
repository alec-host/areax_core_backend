const mongoose = require("mongoose");

const { TikTokPersonDataModel } = require("../../../mongodb.models");

module.exports.retrieveTikTokProfileByReferenceNumber = async(reference_number) => {
    try{
        const records = await TikTokPersonDataModel.find({ reference_number: reference_number }).select({ open_id:1,union_id:1,display_name:1,avatar_url:1,profile_deep_link:1,bio_description:1 });
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
