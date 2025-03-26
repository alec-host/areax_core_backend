const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { TikTokPersonDataModel } = require("../../../mongodb.models");

module.exports.calculateTiktokTokenExpiry = async(reference_number) => {
    try{
        const connection = await mongoDb();
        if(connection){
            const record = await TikTokPersonDataModel.findOne({ reference_number: reference_number },'created_at');
            //const tokenExpiresIn = (record[0].created_at.getTime() - 55 * 24 * 60 * 60 * 1000);
            if(connection){
                const createdAt = record ? record.created_at : null;
                if(createdAt){
                   const currentDate = Date.now();
                   const differenceInDays = Math.floor((currentDate - createdAt) / (24 * 60 * 60 * 1000));
                   console.log('DATE DIFF IN DAYS', differenceInDays);
                   return differenceInDays;
                }else{
                   return null;
                }
            }else{
                return null;
            }
        }
    }catch(error){
        console.error('Error fetching data:', error);
        return null;
    }finally{
        mongoose.connection.close();
    }
};
