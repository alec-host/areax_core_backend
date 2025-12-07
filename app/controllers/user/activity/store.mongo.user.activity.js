const mongoose = require("mongoose");

const { UserActivitiesModel } = require("../../../mongodb.models");

module.exports.saveUserActivityData = async(payload) => {
    try{
        const newUserActivityData = new UserActivitiesModel(payload);
        
        const savedUserData = await newUserActivityData.save();
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
