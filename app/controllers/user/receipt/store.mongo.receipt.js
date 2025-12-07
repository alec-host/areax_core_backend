const mongoose = require("mongoose");

const { ReceiptDataModel } = require("../../../mongodb.models");

module.exports.saveReceiptData = async(payload) => {
    try{
        const newReceiptData = new ReceiptDataModel(payload);
       
        const savedReceiptData = await newReceiptData.save();
        if(savedReceiptData){		
           return savedReceiptData;
        }else{
           console.log('Connection to db has failed');
           return null;
        }
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
        return null;
    }
};
