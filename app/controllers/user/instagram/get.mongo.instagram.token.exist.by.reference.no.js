const mongoose = require("mongoose");
const { InstagramTokenModel } = require("../../../mongodb.models");

module.exports.instagramTokenExistByReferenceNo = async(reference_number) => {
    try{
        const userRecord = await InstagramTokenModel.findOne({reference_number:reference_number});
        if(userRecord){
           return 1;
        }else{
           return 0;
        }
    }catch(err){
        console.error('Error: ',err);
        return 0;
    }
};
