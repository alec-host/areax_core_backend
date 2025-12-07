const mongoose = require("mongoose");

const { TikTokPersonDataModel } = require("../../../mongodb.models");

module.exports.saveTikTokUserProfile = async(payload) => {
    try{
	const filter = { reference_number: payload.reference_number };

        const update = {
	    reference_number: payload.reference_number,	
            display_name: payload.display_name,
            open_id: payload.open_id,
            profile_deep_link: payload.profile_deep_link,
            union_id: payload.union_id,
            avatar_url: payload.avatar_url,
            bio_description: payload.bio_description
        };
        
	const options = { new: true, upsert: true };	
	const result = await TikTokPersonDataModel.findOneAndUpdate(filter, update, options);	
	if(result){
            return result;
        }else{
            console.log('Connection to db has failed');
            return null;
        }
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
        return null;
    }
};
