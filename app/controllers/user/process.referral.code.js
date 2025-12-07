const { db } = require("../../models");

const Users = db.users;
const Referrals = db.referrals;

module.exports.processUserReferral = async(payload) => {
    const transaction = await db.sequelize.transaction();	
    try{
       //-.find the referrer. 	    
       const referer = await Users.findOne({ where: { referral_code: payload.referral_code }, transaction });	    
      
       //-.find the referee.
       const referee = await Users.findOne({ where: { reference_number: payload.reference_number }, transaction });

       if(!referer){
          return [false,'Invalid referral code'];
       }

       //-.self referral check.	    
       if(referer.reference_number === payload.reference_number){
          return [false,'Cannot refer yourself'];
       }	    

       //-.duplicate check.	    
       const existingReferral = await Referrals.findOne({ where: { referee_reference_number: payload.reference_number }, transaction });
       
       if(existingReferral){
          return [false,'User has already been referred'];
       }

       const now = new Date();	    
      
       //-.fraud check.	    
       if(payload.device_fingerprint){ 
	  //-.check whether the device has been used for referral by his referrer or any referrer     
          const deviceUsage = await Referrals.count({ where: { device_fingerprint: payload.device_fingerprint }, transaction });
          //-.mark as fraud
	  if(deviceUsage > 0){
	     await Referrals.create({
                referrer_id: referer._id,
		referrer_reference_number: referer.reference_number,     
		referee_id: referee._id,
		referee_reference_number: payload.reference_number,
		device_fingerprint: payload.device_fingerprint,
		status: 'fraud',
		reward_amount: 0,
		created_at: now,      
	     },{ transaction });

	     await transaction.commit();
	     return [false,'Duplicate device detected'];     
	  }
       }

       const referral = await Referrals.create({
          referrer_id: referer._id,
	  referrer_reference_number: referer.reference_number,     
          referee_id: referee._id,
	  referee_reference_number: payload.reference_number,     
	  device_fingerprint: payload.device_fingerprint,     
          status: 'sign_up', // Waiting for qualification (e.g. email verify)
          reward_amount: 0,
	  created_at: now,     
       },{ transaction });

       await transaction.commit();	    
       return [true,referral];
    }catch(err){
       console.error('Error ',err.message);
       return [false, `Error: ${err.message}`];
    }
};

