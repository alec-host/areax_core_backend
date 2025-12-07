const mongoose = require("mongoose");

const { TikTokTokenModel } = require("../../../mongodb.models");

module.exports.tiktokTokenExistByReferenceNo = async(reference_number) => {
    try{
        const userRecord = await TikTokTokenModel.findOne({reference_number:reference_number});
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
