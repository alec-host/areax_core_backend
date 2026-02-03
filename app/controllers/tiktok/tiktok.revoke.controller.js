const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { DATABASE_DIALECT, MEMORY_QUEUE_NAME, RABBITMQ_QUEUE_LOGS } = require("../../constants/app_constants");

const isSQL = DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo';
const tokenDeleteService = isSQL
    ? require("../user/tiktok/delete.pg.tiktok.token")
    : require("../user/tiktok/delete.mongo.tiktok.token");

const profileDeleteService = isSQL
    ? require("../user/tiktok/delete.pg.tiktok.profile.data")
    : require("../user/tiktok/delete.mongo.tiktok.profile.data");

exports.TiktokRevoke = async (req, res) => {
    const { email, reference_number } = req.body;
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        const email_found = await findUserCountByEmail(email);
        if (email_found > 0) {
            const reference_number_found = await findUserCountByReferenceNumber(reference_number);
            if (reference_number_found > 0) {
                const response_1 = await tokenDeleteService.deleteTiktokUserToken(reference_number);
                const response_2 = await profileDeleteService.deleteTiktokProfileData(reference_number);
                if (response_1 && response_2) {
                    const messageMq = {
                        channel_name: 'activity_log',
                        email: email,
                        reference_number: reference_number,
                        activity_name: `REVOKE TIKTOK ACCESS: Successful`
                    };
                    await sendMessageToQueue(RABBITMQ_QUEUE_LOGS, JSON.stringify(messageMq));
                    res.status(200).json({
                        success: true,
                        error: false,
                        message: 'TikTok Access has been Revoked.'
                    });
                } else {
                    const messageMq = {
                        channel_name: 'error_log',
                        email: email,
                        reference_number: reference_number,
                        error_code: 400,
                        error_message: `ERROR: Attempting to Revoke TikTok Access.`
                    };
                    await sendMessageToQueue(RABBITMQ_QUEUE_LOGS, JSON.stringify(messageMq));
                    res.status(400).json({
                        success: false,
                        error: true,
                        message: "ERROR: Attempting to Revoke TikTok Access."
                    });
                }
            } else {
                res.status(404).json({
                    success: false,
                    error: true,
                    message: "Reference Number not found"
                });
            }
        } else {
            res.status(404).json({
                success: false,
                error: true,
                message: "Email not found"
            });
        }

    } else {
        res.status(422).json({ success: false, error: true, message: errors.array() });
    }
};

