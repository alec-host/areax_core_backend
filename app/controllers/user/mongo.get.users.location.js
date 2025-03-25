const mongoose = require("mongoose");
const { mongoDb } = require("../../db/mongo.db");
const { UserLocationModel } = require("../../mongodb.models");

module.exports.getUsersLocationList = async(page = 1, limit = 10, filter = {}) => {
    try{
        const connection = await mongoDb();
        if(connection){
           const options = {
              page,
              limit,
              sort: { updated_at: 1 }, // Sort by creation date in ascending order
	      select: '_id reference_number lat lng updated_at',	   
           };		
           const result = await UserLocationModel.paginate(filter, options);
	   return result;
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
