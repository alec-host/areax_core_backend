const mongoose = require("mongoose");

const { InstagramUserDataModel } = require("../../../mongodb.models");

module.exports.getUserInstagramProfileExistByReferenceNumber = async(reference_number) => {
    try{
        const query = { 
            reference_number: reference_number,
            is_revoked: 0,
            is_deleted: 0,
        };  
         
        const count = await InstagramUserDataModel.countDocuments(query);
	if(count >= 0){
            return count;
        }else{
            return null;
        }
    }catch(err){
        console.error('ERROR: ', err);
        return null;
    }
};
