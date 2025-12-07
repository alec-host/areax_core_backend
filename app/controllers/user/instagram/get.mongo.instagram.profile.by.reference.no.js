const mongoose = require("mongoose");
const { InstagramUserDataModel } = require("../../../mongodb.models");

module.exports.getUserInstagramProfileByReferenceNo = async(reference_number) => {
    try{
        const user = await InstagramUserDataModel.findOne({reference_number:reference_number}, 'name username account_type profile_picture_url followers_count follows_count media_count');
	if(user){
            return user;
        }else{
            return null;
        }
    }catch(err){
        console.error('Error: ',err);
        return null;
    }
};
