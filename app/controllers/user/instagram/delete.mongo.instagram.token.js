const mongoose = require("mongoose");
const { InstagramTokenModel } = require("../../../mongodb.models");

module.exports.deleteInstagramUserToken = async(reference_number) => {
    try{
        const condition = { reference_number: reference_number };	
        const result = await InstagramTokenModel.deleteOne(condition);
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
