const mongoose = require("mongoose");

const { UtiliyTransaction } = require("../../../mongodb.models");

module.exports.saveUtilityTransaction = async(transactionData) => {
    try{
        const newUtilityTransaction = new UtiliyTransaction(transactionData);
     
        const savedTransactionData = await newUtilityTransaction.save();
        if(savedTransactionData){	
	   return savedTransactionData;	
        }else{
           console.log('Connection to db has failed');
           return null;
        }
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
        return null;
    }
};
