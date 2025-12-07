const mongoose = require("mongoose");

const { DepositTransaction } = require("../../../mongodb.models");

module.exports.saveDepositTransaction = async(transactionData) => {
    try{
        const newDepositTransaction = new DepositTransaction(transactionData);
        
        const savedTransactionData = await newDepositTransaction.save();
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
