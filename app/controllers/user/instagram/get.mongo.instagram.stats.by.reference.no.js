const mongoose = require("mongoose");
const { InstagramUserDataModel } = require("../../../mongodb.models");

module.exports.getInstagramStatsByReferenceNo = async(reference_number) => {
    try{
        const userRecord = await InstagramUserDataModel.findOne({reference_number:reference_number});
        if(userRecord){
           return userRecord;
        }else{
           return null;
        }
    }catch(err){
        console.error('Error: ',err);
        return null;
    }
};
