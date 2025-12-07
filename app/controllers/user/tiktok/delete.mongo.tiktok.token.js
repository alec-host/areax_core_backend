const mongoose = require("mongoose");

const { TikTokTokenModel } = require("../../../mongodb.models");

module.exports.deleteTiktokUserToken = async(reference_number) => {
    try{
        const condition = { reference_number: reference_number };
        const result = await TikTokTokenModel.deleteOne(condition);
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
