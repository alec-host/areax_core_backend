const {v4:uuidv4} = require('uuid');

const { addDays } = require('../../utils/utils');
const { confirmGoogleToken } = require('../../services/GOOGLE-SIGN');
const { sendMessageToQueue } = require("../../services/RABBIT-MQ");
const { findUserCountByEmail } = require('../user/find.user.count.by.email');
const { modifyUserByEmail } = require('../user/modify.user.by.email');
const { sendEmailOtp,sendGridEmailOtp } = require('../../services/NODEMAILER');
const { saveMailOtp } = require('../otp/save.mail.otp');
const { getUserProfileByEmail } = require('../user/get.user.profile.by.email');
const { generateRandomOtp } = require('../../utils/generate.otp');
const { accessToken, refreshToken } = require('../../services/JWT');
const { createUser } = require('../user/create.user');
const { validationResult } = require('express-validator');
const { postPayloadWithJsonPayload } = require('../../utils/post.payload');
const { APPLICATION_BASE_URL,MEMORY_QUEUE_NAME,RABBITMQ_QUEUE_LOGS,DEFAULT_SUBSCRIPTION_PLAN,USER_UID_LEAD_PREFIX,SUBSCRIPTION_VALIDITY_IN_DAYS } = require('../../constants/app_constants');
const { getUserPasswordByEmail } = require("../user/get.user.paswd.by.email");
const { addWalletBalanceByReferenceNumber } = require('../user/add.wallet.amount.credit');
const { getReferenceNumberByEmail } = require('../user/get.user.reference_number.by.email');
const { getSubscriptionTierByName,addSubscriptionPlanByReferenceNumber} = require('../tiers/admin.create.tiers');

exports.GoogleUserSignIn = async(req,res) => {
    const { idToken } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       res.status(422).json({ success: false, error: true, message: errors.array() });	    
       return;
    }
    try{
       console.log('GEN ID TOKEN', idToken);	
       const payload = await confirmGoogleToken(idToken);
       if(!payload || !payload.sub || !payload.name || !payload.email || !payload.given_name){
           res.status(400).json({
               success: false,
               error: true,
               message: 'Invalid or Missing: idToken has to be provided.'
           });
	   return;
       }
       const google_user_id = payload['sub'];
       const username = payload['name'];
       const email = payload['email'];
       const display_name = payload['given_name'];
       const profile_picture_url = payload['picture'] || null;
       const guardian_picture_url = null;	    
       const reference_number = USER_UID_LEAD_PREFIX + uuidv4();
       const access_token = accessToken({ email:email, reference_number:reference_number });
       const refresh_token = refreshToken({ email:email, reference_number:reference_number });
       const newUser = {reference_number,google_user_id,username,display_name,email,profile_picture_url,guardian_picture_url,access_token,refresh_token};
       const reference_number_in = reference_number;

       const found_user = await findUserCountByEmail(email);	    
       if(found_user === 0){
           const otpCode = generateRandomOtp();
           const response = await sendGridEmailOtp(email,otpCode);
           if(!response[0]){
              res.status(400).json({
                  success: false,
                  error: true,
                  message: response[1] || 'Invalid token'
              });		   
	      return;
	   }
           await saveMailOtp({phone:0,email:email,message:response[2]});
           const resp = await createUser(newUser);
           if(!resp[0]){
              res.status(400).json({
                  success: false,
                  error: true,
                  message: resp[1]
              });
	      return;
	   }
           const walletDetails = await postPayloadWithJsonPayload(`${APPLICATION_BASE_URL}/blockchain/api/v1/userWalletDetail`,{ user_id: email });	
           await getUserProfileByEmail(email, async profileCallback => {    
              const payload = {
	          channel_name: 'activity_log',		
                  email: email,
                  reference_number: reference_number,
                  activity_name: `GOOGLE SIGN UP: ${resp[1]} ${response[1]}`
              };
              await sendMessageToQueue(MEMORY_QUEUE_NAME,JSON.stringify(payload));

              await getSubscriptionTierByName(DEFAULT_SUBSCRIPTION_PLAN, async callBack => {
                  if(callBack && callBack.length > 0){
                      const { reference_number, name, monthly_cost, yearly_cost, entry, credits_per_action } = callBack[0];
                      const regex = /\{(\d+)\}/;
                      const creditValue = entry.match(regex);
                      if(creditValue){
                         const currentDate = new Date();
                         const expired_at = addDays(currentDate,Number(SUBSCRIPTION_VALIDITY_IN_DAYS));
                         const walletPayload = { amount:0,credit_points_bought:creditValue[1],plan_name:name,tier_reference_number:reference_number,subscription_plan:'d',expired_at };
                         const walletResp = await addWalletBalanceByReferenceNumber(reference_number_in,walletPayload);
                         const userPayload = { tier_reference_number:reference_number };
                         const planResp = await addSubscriptionPlanByReferenceNumber(reference_number_in,userPayload);
                      }
                  }
              });

	      if(walletDetails[0]){    
                 res.status(201).json({
                     success: true,
                     error: false,
                     data: profileCallback,
                     access_token: access_token,
                     refresh_token: refresh_token,
	             walletData: walletDetails[0],	    
                     message: resp[1] +' '+ response[1]
                 });
	      }else{	
                 const payload = {
		    channel_name: 'error_log',	    
                    email: email,
                    reference_number: reference_number,
	            error_code: 400,	    
                    error_message: `ERROR BLOCKCHAIN WALLET CREATION HAS FAILED: ${walletDetails[1]}`
                 };
                 await sendMessageToQueue(RABBITMQ_QUEUE_LOGS,JSON.stringify(payload));					
                 res.status(200).json({
                     success: true,
                     error: false,
                     data: profileCallback,
                     access_token: access_token,
                     refresh_token: refresh_token,
                     message: `${resp[1]} ${response[1]} | Wallet API has failed: ${walletDetails[1]}`
                 });
	      }
           });                
       }else{
	   const storedPasswordAndEmailVerification = await getUserPasswordByEmail(email);
           if(storedPasswordAndEmailVerification[1] > 0){	
               const resp = await modifyUserByEmail(email,{is_online:1,access_token:access_token,refresh_token:refresh_token});  
               await getUserProfileByEmail(email, async callBack => {
	          const reference_number = callBack[0].reference_number;
	          const payload = {
                      channel_name: 'activity_log',
                      email: email,
                      reference_number: reference_number,
                      activity_name: `SIGN IN: login was successful.`
	          };
                  await sendMessageToQueue(RABBITMQ_QUEUE_LOGS,JSON.stringify(payload));				
	          res.status(200).json({
                      success: true,
                      error: false,
                      data: callBack,
                      access_token: access_token,
                      refresh_token: refresh_token,
                      message: 'Authentication successful'
                  });
               });
           }else{  
	       await getUserProfileByEmail(email,callBack => { 
                   res.status(401).json({
                       success: false,
                       error: true,
	               data: callBack,    
		       access_token: access_token,
		       refresh_token: refresh_token,    
                       message: "Login has failed. Email has not been verified."
                   });
	       });
	   }
       }
   }catch(e){
       if(e){
           res.status(401).json({
               success: false,
               error: true,
               message: "The signin token is invalid or has expired."
           });
       } 
   }
};
