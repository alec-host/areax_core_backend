const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { UserWalletTransaction } = require("../../../mongodb.models");

module.exports.saveUserWalletTransaction = async(transactionData) => {	
    try{	
        const newTransaction = new UserWalletTransaction(transactionData);
        const connection = await mongoDb();
        if(connection){	    
            const savedTransactionData = await newTransaction.save();
	    return savedTransactionData;    
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
