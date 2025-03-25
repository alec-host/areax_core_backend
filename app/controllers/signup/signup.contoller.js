const {v4:uuidv4} = require('uuid');
const { findUserCountByEmail } = require('../user/find.user.count.by.email');
const { sendEmailOtp } = require('../../services/NODEMAILER');
const { saveMailOtp } = require('../otp/save.mail.otp');
const { getUserProfileByEmail } = require('../user/get.user.profile.by.email');
const { generateRandomOtp } = require('../../utils/generate.otp');
const { accessToken, refreshToken } = require('../../services/JWT');
const { encrypt } = require('../../services/CRYPTO');
const { validateEmail } = require('../../validation/validate.email');
const { createUser } = require('../user/create.user');
const { validationResult } = require('express-validator');

exports.UserSignUp = async(req,res) => {
        const { username, email, password } = req.body;
        const errors = validationResult(req);
        if(errors.isEmpty()) {
            try{
                const isEmailValid = await validateEmail(email);
                if(isEmailValid){
                    const google_user_id = 0;
                    const reference_number = 'AXR_'+uuidv4();
                    const profile_picture_url = 'https://';
                    const hashedPassword = await encrypt(password);
                    const access_token = accessToken({email:email});
                    const refresh_token = refreshToken({email:email});
                    const newUser = {reference_number,google_user_id,username,email,profile_picture_url,access_token,refresh_token,password:hashedPassword};

                    const found_email = await findUserCountByEmail(email);
                    if(found_email === 0){
                        const otpCode = generateRandomOtp();
                        const response = await sendEmailOtp(email,otpCode);
                        if(response[0]){
                            await saveMailOtp({phone:0,email:email,message:response[2]});
                            const resp = await createUser(newUser);
                            if(resp[0]){
                                await getUserProfileByEmail(email,profileCallback => {
                                    res.status(201).json({
                                        success: true,
                                        error: false,
                                        data: profileCallback,
                                        access_token: access_token,
                                        refresh_token: reference_number,
                                        message: resp[1]
                                    }); 
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
                        message: "Something wrong has happpened."
                    });
                } 
            }
        }else{
            res.status(422).json({errors: errors.array()});  
        }
};