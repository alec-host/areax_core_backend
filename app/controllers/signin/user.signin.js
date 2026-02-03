const { compare } = require("bcrypt");
const { modifyUserByEmail } = require("../user/modify.user.by.email");
const { accessToken, refreshToken } = require("../../services/JWT");
const { getUserLoginDataByEmail } = require("../user/get.user.login.data.by.email");
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
        // Optimized: Fetch everything in one trip via user service
        const user = await getUserLoginDataByEmail(email);

        // SEC: Use generic error message to prevent email enumeration
        if (!user) {
            res.status(401).json({
                success: false,
                error: true,
                message: "Login has failed. Invalid email or password."
            });
            return;
        }

        const allowedAccess = await compare(password, user.password);

        if (!allowedAccess) {
            res.status(401).json({
                success: false,
                error: true,
                message: "Login has failed. Invalid email or password."
            });
            return;
        }

        const reference_number = user.reference_number;
        const _accessToken = accessToken({ email, reference_number });
        const _refreshToken = refreshToken({ email, reference_number });

        // Map user object to profileData array to maintain existing response structure
        const profileData = [user.toJSON()];

        if (user.email_verified > 0) {
            // EXTREME SPEED: Fire background status update and tokens without blocking the response
            modifyUserByEmail(email, { is_online: 1, access_token: _accessToken, refresh_token: _refreshToken })
                .catch(err => console.error("Background Login Update Error:", err));

            const message = 'Login was successful.';
            const logPayload = {
                channel_name: 'activity_log',
                email: email,
                reference_number: reference_number,
                activity_name: `SIGN IN: ${message}`
            };

            // Logging to RabbitMQ - non-blocking for better responsiveness
            sendMessageToQueue(RABBITMQ_QUEUE_LOGS, JSON.stringify(logPayload)).catch(err => console.error("RabbitMQ Log Error:", err));

            res.status(200).json({
                success: true,
                error: false,
                data: profileData,
                access_token: _accessToken,
                refresh_token: _refreshToken,
                message: message
            });
            return;
        } else {
            // Email not verified block
            res.status(401).json({
                success: false,
                error: true,
                data: profileData,
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

