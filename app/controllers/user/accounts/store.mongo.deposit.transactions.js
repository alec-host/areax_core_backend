const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { DepositTransaction } = require("../../../mongodb.models");

module.exports.saveDepositTransaction = async(transactionData) => {
    try{
	const connection = await mongoDb();    
        const newDepositTransaction = new DepositTransaction(transactionData);
        if(connection){
            const savedTransactionData = await newDepositTransaction.save();
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
