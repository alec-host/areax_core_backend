const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { ReceiptDataModel } = require("../../../mongodb.models");

module.exports.saveReceiptData = async(payload) => {
    try{
        const newReceiptData = new ReceiptDataModel(payload);
        const connection = await mongoDb();
        if(connection){
            const savedReceiptData = await newReceiptData.save();
            return savedReceiptData;
        }else{
            console.log('Connection to db has failed');
            return null;
        }
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
        return null;
    }finally{
        mongoose.connection.close();
    }
};
