const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { DATABASE_DIALECT, MEMORY_QUEUE_NAME, RABBITMQ_QUEUE_LOGS } = require("../../constants/app_constants");

const revokeService = (DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo')
    ? require('../user/instagram/store.pg.instagram.token')
    : require('../user/instagram/store.mongo.instagram.token');

exports.InstagramRevoke = async (req, res) => {
    const { email, reference_number } = req.body;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, error: true, message: errors.array() });
    }
    try {
        const payload = { reference_number };
        // EXTREME SPEED: parallelize existence checks and revocation
        const [email_found, reference_number_found, response] = await Promise.all([
            findUserCountByEmail(email),
            findUserCountByReferenceNumber(reference_number),
            revokeService.revokeInstagramUserToken(payload)
        ]);

        if (email_found === 0) {
            res.status(404).json({
                success: false,
                error: true,
                message: "Email not found"
            });
            return;
        }
        if (reference_number_found === 0) {
            res.status(404).json({
                success: false,
                error: true,
                message: "Reference Number not found"
            });
            return;
        }

        if (response[0]) {
            const messageMq = {
                channel_name: 'activity_log',
                email: email,
                reference_number: reference_number,
                activity_name: `REVOKE IG ACCESS: ${response[1]}`
            };
            await sendMessageToQueue(RABBITMQ_QUEUE_LOGS, JSON.stringify(messageMq));
            res.status(200).json({
                success: true,
                error: false,
                message: response[1]
            });
            return;
        }
        const messageMq = {
            channel_name: 'error_log',
            email: email,
            reference_number: reference_number,
            error_code: 400,
            error_message: `ERROR: Attempting to Revoke IG Access.`
        };
        await sendMessageToQueue(RABBITMQ_QUEUE_LOGS, JSON.stringify(messageMq));
        res.status(400).json({
            success: false,
            error: true,
            message: response[1]
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: true,
            message: e?.message || 'Something wrong has happened'
        });
    }
};

