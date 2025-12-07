const mongoose = require("mongoose");

const { InstagramUserDataModel } = require("../../../mongodb.models");

module.exports.deleteInstagramProfileData = async(reference_number) => {
    try{
        const condition = { reference_number: reference_number };
        const result = await InstagramUserDataModel.deleteOne(condition);
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
