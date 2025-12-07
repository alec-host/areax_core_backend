const mongoose = require("mongoose");

const { UserWalletTransaction } = require("../../../mongodb.models");

module.exports.getUserWalletTransaction = async(page=1,limit=10,referenceNumber = '') => {
    try{
	 
	const filter = {};

	if(referenceNumber){
	   filter.reference_number = referenceNumber;	
	}

	const options = {
           page,
	   limit,
	   sort: { created_at: -1 }
	};  

	const result = await UserWalletTransaction.paginate(filter, options); 
        if(result){		
	   return result;	
	}else{
	   console.log('Connection to db has failed');
	   return null;	
	}
    }catch(err){
        console.error('Error: failed to insert or update. ',err);
        return null;
    }
};
