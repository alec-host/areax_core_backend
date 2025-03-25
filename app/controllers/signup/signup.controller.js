const {v4:uuidv4} = require('uuid');

const { addDays } = require('../../utils/utils');
const { findUserCountByEmail } = require('../user/find.user.count.by.email');
const { sendEmailOtp } = require('../../services/NODEMAILER');
const { sendMessageToQueue } = require("../../services/RABBIT-MQ");
const { saveMailOtp } = require('../otp/save.mail.otp');
const { getUserProfileByEmail } = require('../user/get.user.profile.by.email');
const { generateRandomOtp } = require('../../utils/generate.otp');
const { accessToken, refreshToken } = require('../../services/JWT');
const { encrypt } = require('../../services/CRYPTO');
const { validateEmail } = require('../../validation/validate.email');
const { createUser } = require('../user/create.user');
const { validationResult } = require('express-validator');
const { postPayloadWithJsonPayload } = require('../../utils/post.payload');
const { getReferenceNumberByEmail } = require('../user/get.user.reference_number.by.email');
const { APPLICATION_BASE_URL,MEMORY_QUEUE_NAME,DEFAULT_SUBSCRIPTION_PLAN,USER_UID_LEAD_PREFIX,SUBSCRIPTION_VALIDITY_IN_DAYS } = require('../../constants/app_constants');
const { addWalletBalanceByReferenceNumber } = require('../user/add.wallet.amount.credit');
const { getSubscriptionTierByName,addSubscriptionPlanByReferenceNumber} = require('../tiers/admin.create.tiers');

exports.UserSignUp = async(req,res) => {
        const { username, email, password } = req.body;
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            try{
                const isEmailValid = await validateEmail(email);
                if(isEmailValid){

                    const google_user_id = 0;
                    const reference_number = USER_UID_LEAD_PREFIX + uuidv4();
                    const profile_picture_url = 'https://';
                    const hashedPassword = await encrypt(password);	
                    const access_token = accessToken({ email:email,reference_number:reference_number });
                    const refresh_token = refreshToken({ email:email,reference_number:reference_number });
                    const reference_number_in = reference_number;
                    const found_email = await findUserCountByEmail(email);
                    if(found_email === 0){
                        const otpCode = generateRandomOtp();
                        const response = await sendEmailOtp(email,otpCode);
                        if(response[0]){
                            await saveMailOtp({phone:0,email:email,message:response[2]});
		            const newUser = { reference_number,google_user_id,username,email,profile_picture_url,access_token,refresh_token,password:hashedPassword };		
                            const resp = await createUser(newUser);
                            if(resp[0]){
				const walletDetails = await postPayloadWithJsonPayload(`${APPLICATION_BASE_URL}/blockchain/api/v1/userWalletDetail`,{ user_id: email });    
                                await getUserProfileByEmail(email, async profileCallback => {
                                    const payload = {
                                        channel_name: 'activity_log',
                                        email: email,
                                        reference_number: reference_number,
                                        activity_name: `SIGN UP: ${resp[1]} ${response[1]}`
                                    };
                                    await sendMessageToQueue(MEMORY_QUEUE_NAME,JSON.stringify(payload));
					
                                    await getSubscriptionTierByName(DEFAULT_SUBSCRIPTION_PLAN, async callBack => {
	                                if(callBack && callBack.length > 0){
		                             const { reference_number, name, monthly_cost, yearly_cost, entry, credits_per_action } = callBack[0];
					     const regex = /\{(\d+)\}/;
					     const creditValue = entry.match(regex);
                                             if(creditValue){
						const currentDate = new Date();
						const expired_at = addDays(currentDate, Number(SUBSCRIPTION_VALIDITY_IN_DAYS));     
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
                                            message: resp[1]
                                        });
				    }else{
                                        const payload = {
                                            channel_name: 'error_log',
                                            email: email,
                                            reference_number: reference_number,
                                            error_code: 400,
                                            error_message: `ERROR BLOCKCHAIN WALLET CREATION HAS FAILED: ${walletDetails[1]}`
                                        };
                                        await sendMessageToQueue(MEMORY_QUEUE_NAME,JSON.stringify(payload));
				        res.status(201).json({
                                            success: true,
                                            error: false,
                                            data: profileCallback,
                                            access_token: access_token,
                                            refresh_token: refresh_token,
                                            message: `${resp[1]} | Wallet API has failed: ${walletDetails[1]}`
                                        });
				    }
                                });                                               
                            }else{
                                res.status(500).json({
                                    success: false,
                                    error: true,
                                    message: resp[1]
                                });
                            }
                        }else{
                            res.status(400).json({
                                success: false,
                                error: true,
                                message: response[1] || 'Invalid token'
                            });
                        }               
                    }else{
                        res.status(200).json({
                            success: false,
                            error: true,
                            message: 'Email already exists'
                        });
                    }
                }else{
                    res.status(400).json({
                        success: false,
                        error: true,
                        message: 'Invalid email.'
                    });
                } 
            }catch(e){
                if(e){
                    res.status(400).json({
                        success: false,
                        error: true,
                        message: e?.response || e?.response?.message || "Something wrong has happpened."
                    });
                } 
            }
        }else{
            res.status(422).json({ success: false, error: true, message: errors.array() });  
        }
};
