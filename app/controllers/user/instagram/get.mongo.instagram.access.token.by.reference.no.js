const mongoose = require("mongoose");
const { InstagramTokenModel } = require("../../../mongodb.models");

module.exports.getInstagramAccessTokenByReferenceNo = async(reference_number) => {
    try{
        const userRecord = await InstagramTokenModel.findOne({reference_number:reference_number});
        if(userRecord){
           return userRecord.long_lived_token;
        }else{
           return null;
        }
    }catch(err){
        console.error('Error: ',err);
        return null;
    }
};
