const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

const { addDays } = require('../../utils/utils');
const { confirmGoogleToken } = require('../../services/GOOGLE-SIGN');
const { sendMessageToQueue } = require("../../services/RABBIT-MQ");
const { modifyUserByEmail } = require('../user/modify.user.by.email');
const { sendEmailOtp, sendGridEmailOtp } = require('../../services/NODEMAILER');
const { saveMailOtp } = require('../otp/save.mail.otp');
const { getUserProfileByEmail } = require('../user/get.user.profile.by.email');
const { generateRandomOtp } = require('../../utils/generate.otp');
const { accessToken, refreshToken } = require('../../services/JWT');
const { createUser } = require('../user/create.user');
const { validationResult } = require('express-validator');
const { processUserReferral } = require('../user/process.referral.code');
const { getUserLoginDataByEmail } = require("../user/get.user.login.data.by.email");
//const { postPayloadWithJsonPayload } = require('../../utils/post.payload');
const { APPLICATION_BASE_URL, MEMORY_QUEUE_NAME, RABBITMQ_QUEUE_LOGS, DEFAULT_SUBSCRIPTION_PLAN, USER_UID_LEAD_PREFIX, SUBSCRIPTION_VALIDITY_IN_DAYS } = require('../../constants/app_constants');
//const { addWalletBalanceByReferenceNumber } = require('../user/add.wallet.amount.credit');
//const { getSubscriptionTierByName, addSubscriptionPlanByReferenceNumber } = require('../tiers/admin.create.tiers');

exports.GoogleUserSignIn = async (req, res) => {
    const { idToken, referral_code, device_fingerprint } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ success: false, error: true, message: errors.array() });
        return;
    }
    try {
        // Speculative decoding (non-verified) to get email in <1ms
        const decodedToken = jwt.decode(idToken);
        const speculativeEmail = decodedToken?.email || req.body.email; // Fallback to body if decode fails

        // EXTREME SPEED: Parallel Google verify + DB fetch
        const [payload, user] = await Promise.all([
            confirmGoogleToken(idToken),
            getUserLoginDataByEmail(speculativeEmail)
        ]);

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

        if (!user) {
            // -- REGISTRATION FLOW (NEW USER) --
            const reference_number = USER_UID_LEAD_PREFIX + uuidv4();
            const access_token = accessToken({ email, reference_number });
            const refresh_token = refreshToken({ email, reference_number });

            const newUser = {
                reference_number, google_user_id, username, display_name,
                email, profile_picture_url, guardian_picture_url,
                access_token, refresh_token
            };

            const otpCode = generateRandomOtp();
            const otpPayload = {
                channel_name: 'otp_delivery', email, otp_code: otpCode,
                timestamp: new Date().toISOString(),
                metadata: { source: 'google_auth', delivery_type: 'email' }
            };

            // EXTREME SPEED: Trigger OTP and Creation in parallel
            const [otpResult, createResult] = await Promise.all([
                saveMailOtp({ phone: 0, email: email, message: `OTP queued: ${otpCode}` }),
                createUser(newUser)
            ]);

            // Background Tasks
            sendMessageToQueue(MEMORY_QUEUE_NAME, JSON.stringify(otpPayload)).catch(e => console.error("RabbitMQ OTP Error:", e));

            if (!createResult[0]) {
                res.status(400).json({ success: false, error: true, message: createResult[1] });
                return;
            }

            const createdUserObject = createResult[2];
            const profileData = [createdUserObject.toJSON ? createdUserObject.toJSON() : createdUserObject];

            const activityPayload = {
                channel_name: 'activity_log', email, reference_number,
                activity_name: `GOOGLE SIGN UP: ${createResult[1]} OTP queued.`
            };
            sendMessageToQueue(MEMORY_QUEUE_NAME, JSON.stringify(activityPayload)).catch(e => console.error("RabbitMQ Activity Error:", e));

            if (referral_code) {
                processUserReferral({ email, reference_number, referral_code, device_fingerprint })
                    .catch(e => console.error("Referral Error:", e));
            }

            res.status(201).json({
                success: true, error: false,
                data: profileData, access_token, refresh_token,
                message: `${createResult[1]} OTP queued for delivery.`
            });

        } else {
            // -- SIGN-IN FLOW (EXISTING USER) --
            const reference_number = user.reference_number;
            const access_token = accessToken({ email, reference_number });
            const refresh_token = refreshToken({ email, reference_number });
            const emailVerified = user.email_verified;

            // Map user object to profileData array
            const profileData = [user.toJSON ? user.toJSON() : user];

            if (emailVerified > 0) {
                // EXTREME SPEED: Fire background tasks and update statuses without blocking the response
                modifyUserByEmail(email, { is_online: 1, access_token: access_token, refresh_token: refresh_token })
                    .catch(e => console.error("Background Update Error:", e));

                const logPayload = {
                    channel_name: 'activity_log', email, reference_number,
                    activity_name: `SIGN IN: login was successful.`
                };
                sendMessageToQueue(RABBITMQ_QUEUE_LOGS, JSON.stringify(logPayload)).catch(e => console.error("RabbitMQ Log Error:", e));

                // Respond immediately as tokens and data are already in memory
                res.status(200).json({
                    success: true, error: false,
                    data: profileData, access_token, refresh_token,
                    message: 'Authentication successful'
                });
            } else {
                res.status(401).json({
                    success: false, error: true,
                    data: profileData, access_token, refresh_token,
                    message: "Login has failed. Email has not been verified."
                });
            }
        }
    } catch (e) {
        const errorMsg = e?.response?.message || e?.message || "Internal Server Error";
        const email = speculativeEmail || req.body.email || "Unknown";

        const errorPayload = {
            channel_name: 'error_log', email, reference_number: 'None',
            error_code: 500, error_message: `GOOGLE AUTH ERROR: ${errorMsg}`
        };
        sendMessageToQueue(RABBITMQ_QUEUE_LOGS, JSON.stringify(errorPayload)).catch(err => console.error("RabbitMQ Error Log:", err));

        res.status(401).json({
            success: false, error: true,
            message: "The signin token is invalid or has expired."
        });
    }
};
