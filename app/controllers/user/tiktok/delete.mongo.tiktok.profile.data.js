const mongoose = require("mongoose");

const { TikTokPersonDataModel } = require("../../../mongodb.models");

module.exports.deleteTiktokProfileData = async(reference_number) => {
    try{
        const condition = { reference_number: reference_number };
        const result = await TikTokPersonDataModel.deleteOne(condition);
        if(result.deletedCount === 1){
           return true;
        }else{
           return false;
        }
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
        return false;
    }
};
