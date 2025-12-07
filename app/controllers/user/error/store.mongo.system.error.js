const mongoose = require("mongoose");

const { SystemErrorsModel } = require("../../../mongodb.models");

module.exports.saveSystemErrors = async(payload) => {
    try{
        const newSystemErrorsData = new SystemErrorsModel(payload);
     
        const savedUserData = await newSystemErrorsData.save();
        if(savedUserData){		
            return savedUserData;
        }else{
            console.log('Connection to db has failed');
            return null;
        }
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
        return null;
    }
};
