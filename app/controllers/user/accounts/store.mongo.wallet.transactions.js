const mongoose = require("mongoose");
const { UserWalletTransaction } = require("../../../mongodb.models");

module.exports.saveUserWalletTransaction = async(transactionData) => {	
    try{	
        const newTransaction = new UserWalletTransaction(transactionData);
       
        const savedTransactionData = await newTransaction.save();
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
