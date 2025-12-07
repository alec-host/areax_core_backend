const mongoose = require("mongoose");
const { InstagramUserDataModel } = require("../../../mongodb.models");

module.exports.getInstagramIdByReferenceNo = async(reference_number) => {
    try{
        const userRecord = await InstagramUserDataModel.findOne({reference_number:reference_number});
        if(userRecord){
           return userRecord.user_id;
        }else{
           return null;
        }
    }catch(err){
        console.error('Error: ',err);
        return null;
    }
};
