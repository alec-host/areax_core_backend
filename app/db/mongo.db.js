const mongoose = require("mongoose");
const { MONGO_USER, MONGO_PASS, MONGO_PORT, MONGO_DATABASE_NAME } = require("../constants/app_constants");

let connected = false;

mongoose.set('debug', true);
async function mongoDb(opts = {}){
    try{
        const url = `mongodb://${MONGO_USER}:${MONGO_PASS}@localhost:${MONGO_PORT}/${MONGO_DATABASE_NAME}`;
        if(connected || mongoose.connection.readyState === 1) return mongoose;
        await mongoose.connect(url, {
           dbName: MONGO_DATABASE_NAME,
           ... opts
        });
        connected = true;
        console.log(`MongoDB Connected: ${connected}`);
        mongoose.connection.on('disconnected', ()=> { connected=false; });
        return mongoose;
    }catch(error){
        console.error(`Error connecting to MongoDB: ${err.message}`);
        return null;
    }
};

module.exports = { mongoDb, mongoose};
