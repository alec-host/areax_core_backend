const { v4: uuidv4 } = require('uuid');

const { addDays } = require('../../utils/utils');
const { confirmGoogleToken } = require('../../services/GOOGLE-SIGN');
const { sendMessageToQueue } = require("../../services/RABBIT-MQ");
const { findUserCountByEmail } = require('../user/find.user.count.by.email');
const { modifyUserByEmail } = require('../user/modify.user.by.email');
const { sendEmailOtp, sendGridEmailOtp } = require('../../services/NODEMAILER');
const { saveMailOtp } = require('../otp/save.mail.otp');
const { getUserProfileByEmail } = require('../user/get.user.profile.by.email');
const { generateRandomOtp } = require('../../utils/generate.otp');
const { accessToken, refreshToken } = require('../../services/JWT');
const { createUser } = require('../user/create.user');
const { validationResult } = require('express-validator');
const { processUserReferral } = require('../user/process.referral.code');
//const { postPayloadWithJsonPayload } = require('../../utils/post.payload');
const { APPLICATION_BASE_URL, MEMORY_QUEUE_NAME, RABBITMQ_QUEUE_LOGS, DEFAULT_SUBSCRIPTION_PLAN, USER_UID_LEAD_PREFIX, SUBSCRIPTION_VALIDITY_IN_DAYS } = require('../../constants/app_constants');
const { getUserPasswordByEmail } = require("../user/get.user.paswd.by.email");
//const { addWalletBalanceByReferenceNumber } = require('../user/add.wallet.amount.credit');
const { getReferenceNumberByEmail } = require('../user/get.user.reference_number.by.email');
//const { getSubscriptionTierByName, addSubscriptionPlanByReferenceNumber } = require('../tiers/admin.create.tiers');

exports.GoogleUserSignIn = async (req, res) => {
    const { idToken, referral_code, device_fingerprint } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ success: false, error: true, message: errors.array() });
        return;
    }
    try {
        console.log('GEN ID TOKEN', idToken);
        const payload = await confirmGoogleToken(idToken);
        if (!payload || !payload.sub || !payload.name || !payload.email || !payload.given_name) {
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
        const access_token = accessToken({ email: email, reference_number: reference_number });
        const refresh_token = refreshToken({ email: email, reference_number: reference_number });
        const newUser = { reference_number, google_user_id, username, display_name, email, profile_picture_url, guardian_picture_url, access_token, refresh_token, referral_code };
        const reference_number_in = reference_number;    

        const found_user = await findUserCountByEmail(email);
        if (found_user === 0) {
            const otpCode = generateRandomOtp();

            const otpPayload = {
                channel_name: 'otp_delivery',
                email: email,
                otp_code: otpCode,
                timestamp: new Date().toISOString(),
                metadata: {
                    source: 'google_auth',
                    delivery_type: 'email'
                }
            };

            await sendMessageToQueue(MEMORY_QUEUE_NAME, JSON.stringify(otpPayload));
            
            const response = await sendGridEmailOtp(email, otpCode);
            if (!response[0]) {
                res.status(400).json({
                    success: false,
                    error: true,
                    message: response[1] || 'Invalid token'
                });
                return;
            }
            
            await saveMailOtp({ phone: 0, email: email, message: `OTP queued: ${otpCode}` });

            const resp = await createUser(newUser);
            if (!resp[0]) {
                res.status(400).json({
                    success: false,
                    error: true,
                    message: resp[1]
                });
                return;
            }

            const profileCallback = await getUserProfileByEmail(email);

            const payload = {
                channel_name: 'activity_log',
                email: email,
                reference_number: reference_number,
                activity_name: `GOOGLE SIGN UP: ${resp[1]} OTP queued for delivery.`
            };

            await sendMessageToQueue(MEMORY_QUEUE_NAME, JSON.stringify(payload));

            //-.referral code.
            if(referral_code){
               const [okReferral, responseReferral] = await processUserReferral({ email, reference_number, referral_code, device_fingerprint });
               console.log(responseReferral);
	    }

            res.status(200).json({
                success: true,
                error: false,
                data: profileCallback,
                access_token: access_token,
                refresh_token: refresh_token,
                message: `${resp[1]} OTP queued for delivery.`
            });
        } else {
            const storedPasswordAndEmailVerification = await getUserPasswordByEmail(email);
            if (storedPasswordAndEmailVerification[1] > 0) {
                const resp = await modifyUserByEmail(email, { is_online: 1, access_token: access_token, refresh_token: refresh_token });
                const callBack = await getUserProfileByEmail(email);
                const reference_number = callBack[0].reference_number;
                const payload = {
                    channel_name: 'activity_log',
                    email: email,
                    reference_number: reference_number,
                    activity_name: `SIGN IN: login was successful.`
                };
                await sendMessageToQueue(RABBITMQ_QUEUE_LOGS, JSON.stringify(payload));
                res.status(200).json({
                    success: true,
                    error: false,
                    data: callBack,
                    access_token: access_token,
                    refresh_token: refresh_token,
                    message: 'Authentication successful'
                });
            } else {
                const callBack = await getUserProfileByEmail(email);
                res.status(401).json({
                    success: false,
                    error: true,
                    data: callBack,
                    access_token: access_token,
                    refresh_token: refresh_token,
                    message: "Login has failed. Email has not been verified."
                });
            }
        }
    } catch (e) {
        if (e) {
            res.status(401).json({
                success: false,
                error: true,
                message: "The signin token is invalid or has expired."
            });
        }
    }
};
