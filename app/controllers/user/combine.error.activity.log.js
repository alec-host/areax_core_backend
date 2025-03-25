const mongoose = require("mongoose");
const { mongoDb } = require("../../db/mongo.db");
const { UserActivitiesModel,SystemErrorsModel } = require("../../mongodb.models");

module.exports.combinedErrorActivityData = async(payload) => {
    try{
        const connection = await mongoDb();   
	const { page, limit, search } = payload;

        if(connection){
            const options = { skip: (page - 1) * limit, limit: parseInt(limit), };

            const userActivities = await UserActivitiesModel.find(search)
		.select('reference_number email activity_name time_stamp')
		//.sort({ time_stamp: -1 })
		.lean()
		.skip(options.skip).limit(options.limit);

	    const systemErrors = await SystemErrorsModel.find(search) 
                .select('reference_number email error_code error_message time_stamp')
		//.sort({ time_stamp: -1 })
		.lean()
		.skip(options.skip).limit(options.limit);

            /*		
	    const combinedResults = [ 
	       ...userActivities.map(record => ({ 
		  reference_number: record.reference_number,
		  email: record.email,
		  activity_description: record.activity_name,
		  timestamp: record.time_stamp 
	       })), 
	       ...systemErrors.map(record => ({ 
		  reference_number: record.reference_number,
		  email: record.email, 
		  activity_description: `ERROR: ${record.error_code} - ${record.error_message}`, 
		  timestamp: record.time_stamp 
	       })) 
	    ];
	    combinedResults.sort((a, b) => b.timestamp - a.timestamp);
	    */

            const combinedResults = [
               ...userActivities,
               ...systemErrors.map(record => ({
                  reference_number: record.reference_id,
                  email: record.email,
                  activity_description: `ERROR: ${record.error_code} - ${record.error_message}`,
                  timestamp: record.time_stamp
               }))
            ];

            const optimizedResults = combinedResults
               .map(record => ({
                   reference_number: record.reference_number,
                   email: record.email,
                   activity_description: record.activity_description || record.activity_name,
                   timestamp: record.time_stamp
                }))
                .sort((a, b) => b.timestamp - a.timestamp);
		
            return optimizedResults;
        }else{
            console.log('Connection to db has failed');
            return null;
        }
    }catch(err){
        console.error('Error: ',err.message);
        return null;
    }finally{
        mongoose.connection.close();
    }
}; 
