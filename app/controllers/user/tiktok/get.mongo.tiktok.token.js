const mongoose = require("mongoose");

const { TikTokTokenModel } = require("../../../mongodb.models");

module.exports.getTikTokAccessTokenByReferenceNumber = async(reference_number) => {
    try{
       const records = await TikTokTokenModel.findOne({ reference_number: reference_number }).select({ access_token:1,refresh_token:1,_id:0 });
       if(records){	       
          return records;
       }else{
          console.log('Connection to db has failed');
          return null;
       }
    }catch(err){
       console.error('Error: failed to retrieve records. ',err);
       return null;
    }
};
