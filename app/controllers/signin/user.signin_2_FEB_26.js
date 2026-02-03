const { compare } = require("bcrypt");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { getUserPasswordByEmail } = require("../user/get.user.paswd.by.email");
const { modifyUserByEmail } = require("../user/modify.user.by.email");
const { accessToken, refreshToken } = require("../../services/JWT");
const { getUserProfileByEmail } = require("../user/get.user.profile.by.email");
const { getReferenceNumberByEmail } = require('../user/get.user.reference_number.by.email');
const { sendMessageToQueue } = require("../../services/RABBIT-MQ");
const { MEMORY_QUEUE_NAME, RABBITMQ_QUEUE_LOGS } = require("../../constants/app_constants");
const { validationResult } = require("express-validator");

exports.SignIn = async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ success: false, error: true, message: errors.array() });
        return;
    }
    try {

        const storedPasswordAndEmailVerification = await getUserPasswordByEmail(email);

        // SEC: Use generic error message to prevent email enumeration
        if (!storedPasswordAndEmailVerification || storedPasswordAndEmailVerification.length === 0) {
            res.status(401).json({
                success: false,
                error: true,
                message: "Login has failed. Invalid email or password."
            });
            return;
        }

        const [hashedPassword, emailVerified] = storedPasswordAndEmailVerification;
        const allowedAccess = await compare(password, hashedPassword);

        if (!allowedAccess) {
            res.status(401).json({
                success: false,
                error: true,
                message: "Login has failed. Invalid email or password."
            });
            return;
        }

        const reference_number = await getReferenceNumberByEmail(email);
        const _accessToken = accessToken({ email, reference_number });
        const _refreshToken = refreshToken({ email, reference_number });

        if (emailVerified > 0) {
            const signIn = await modifyUserByEmail(email, { is_online: 1, access_token: _accessToken, refresh_token: _refreshToken });
            if (signIn) {
                const profileData = await getUserProfileByEmail(email);
                const userRef = profileData?.[0]?.reference_number || reference_number;
                const message = 'Login was successful.';
                const logPayload = {
                    channel_name: 'activity_log',
                    email: email,
                    reference_number: userRef,
                    activity_name: `SIGN IN: ${message}`
                };

                // Logging to RabbitMQ - non-blocking for better responsiveness
                sendMessageToQueue(RABBITMQ_QUEUE_LOGS, JSON.stringify(logPayload)).catch(err => console.error("RabbitMQ Log Error:", err));

                res.status(200).json({
                    success: true,
                    error: false,
                    data: profileData || [],
                    access_token: _accessToken,
                    refresh_token: _refreshToken,
                    message: message
                });
                return;
            }
        } else {
            // Email not verified block
            const profileData = await getUserProfileByEmail(email);
            res.status(401).json({
                success: false,
                error: true,
                data: profileData || [],
                access_token: _accessToken,
                refresh_token: _refreshToken,
                message: "Login has failed. Email has not been verified."
            });
            return;
        }

        // Fallback error
        res.status(400).json({
            success: false,
            error: true,
            message: "Login has failed."
        });

    } catch (e) {
        const message = e?.response?.message || e?.message || 'Something wrong has happened';
        const errorPayload = {
            channel_name: 'error_log',
            email: email,
            reference_number: 'None',
            error_code: 500,
            error_message: `ERROR: ${message}`
        };
        sendMessageToQueue(RABBITMQ_QUEUE_LOGS, JSON.stringify(errorPayload)).catch(err => console.error("RabbitMQ Error Log:", err));

        res.status(500).json({
            success: false,
            error: true,
            message: message
        });
    }
};

