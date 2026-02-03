const { db } = require("../../models");

const Users = db.users;
const Referrals = db.referrals;

module.exports.processUserReferral = async (payload) => {
   const transaction = await db.sequelize.transaction();
   try {
      //-.find the referrer and referee in parallel.
      const [referer, referee] = await Promise.all([
         Referrals.findOne({ where: { referral_code: payload.referral_code }, transaction }),
         Users.findOne({ where: { reference_number: payload.reference_number }, transaction })
      ]);

      if (!referer) {
	 await transaction.rollback();     
         return [false, 'The referral code you entered is not valid.'];
      }

      //-.self referral check.
      if (referer.referrer_reference_number === payload.reference_number) {
	 await transaction.rollback();    
         return [false, 'You cannot use your own referral code.'];
      }

      if (!referee){
	  await transaction.rollback();    
	  return [false, 'Referee not found'];
      }

      const existingReferral = await Referrals.findOne({ where: { referee_reference_number: payload.reference_number }, transaction });

      if (existingReferral) {
	 await transaction.rollback();     
         return [false, 'This user has already been referred.'];
      }

      const now = new Date();

      //-.fraud check.
      /*
      if (payload.device_fingerprint) {
         //-.check whether the device has been used for referral by his referrer or any referrer
         const deviceUsage = await Referrals.count({ where: { device_fingerprint: payload.device_fingerprint }, transaction });
         //-.mark as fraud
         if (deviceUsage > 0) {
            await referer.update({
               referee_id: referee._id,
               referee_reference_number: payload.reference_number,
               device_fingerprint: payload.device_fingerprint,
               status: 'fraud',
               reward_amount: 0,
               created_at: now,
            }, { transaction });

            await transaction.commit();
            return [false, 'This device has already been used for a referral.'];
         }
      }
      */
      const referral = await referer.update(
         {
            device_fingerprint: payload.device_fingerprint,
            referee_id: referee._id,
            referee_reference_number: payload.reference_number,
            status: 'sign_up', // Waiting for qualification (e.g. email verify)
            created_at: now,
         },
         {
            //where: { referral_code: payload.referral_code }, // <-- condition to find the row
            transaction,
         }
      );

      await transaction.commit();

      return [true, referral];
   } catch (err) {
      if (transaction) await transaction.rollback();
      console.error('processUserReferral Error:', err.message);	   
      console.error('Error ', err.message);
      return [false, `Error: ${err.message}`];
   }
};

module.exports.confirmRefereeEmail = async (email, reference_number) => {
   const transaction = await db.sequelize.transaction(); // 1. Start Transaction
   try {
      // 2. Optimization: Select only necessary fields
      const existingReferral = await Referrals.findOne({
         where: { referee_reference_number: reference_number },
         attributes: ['referrer_reference_number', 'status'], // Only fetch what we need
         transaction
      });

      if (!existingReferral) {
         await transaction.rollback();
         return [false, 'Referee Not found'];
      }

      // 3. FIX: Use correct property 'referrer_reference_number'
      const referer = await Users.findOne({
         where: { reference_number: existingReferral.referrer_reference_number },
         attributes: ['_id', 'email'], // Optimization
         transaction
      });

      if (!referer) {
         await transaction.rollback();
         return [false, 'Referer Not found'];
      }

      // 4. Update with check
      const [affectedRows] = await Referrals.update(
         {
            status: 'active',
         },
         {
            where: {
               status: 'sign_up',
               referee_reference_number: reference_number
            },
            transaction
         }
      );

      if (affectedRows === 0) {
         await transaction.rollback();
         return [false, 'Referral status invalid or already verified'];
      }

      await transaction.commit();
      const referrer_email = referer.email;
      const referee_email = email;
      return [true, { referrer_email, referee_email }];
   } catch (err) {
      if (transaction) await transaction.rollback();
      console.error('confirmRefereeEmail Error:', err.message);	   
      return [false, err?.message];
   }
};

