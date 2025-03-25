const mongoose = require("mongoose");
const { mongoDb } = require("../../../db/mongo.db");
const { UtiliyTransaction } = require("../../../mongodb.models");

module.exports.saveUtilityTransaction = async(transactionData) => {
    try{
        const newUtilityTransaction = new UtiliyTransaction(transactionData);
        const connection = await mongoDb();
        if(connection){
            const savedTransactionData = await newUtilityTransaction.save();
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
