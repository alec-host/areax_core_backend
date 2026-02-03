const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { DATABASE_DIALECT } = require("../../constants/app_constants");
const { igApiWithIgLogin } = require("../../services/INSTAGRAM");
const { storeUserInstagramActivityLog } = require("../user/instagram/store.user.instagram.activity.log");

const isSQL = DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo';

const { calculateInstagramTokenExpiry } = isSQL
    ? require("../user/instagram/calculate.pg.instagram.token.expiry.date")
    : require("../user/instagram/calculate.mongo.instagram.token.expiry.date");

const { getUserInstagramProfileExistByReferenceNumber } = isSQL
    ? require("../user/instagram/get.pg.instagram.profile.count.by.reference.no")
    : require("../user/instagram/get.mongo.instagram.profile.count.by.reference.no");

const { deleteInstagramUserToken } = isSQL
    ? require("../user/instagram/delete.pg.instagram.token")
    : require("../user/instagram/delete.mongo.instagram.token");

const { deleteInstagramProfileData } = isSQL
    ? require("../user/instagram/delete.pg.instagram.profile.data")
    : require("../user/instagram/delete.mongo.instagram.profile.data");

const { generateRandomHash } = require("../../utils/generate.random.hash");
const { sendMessageToQueue } = require("../../services/RABBIT-MQ");
const { MEMORY_QUEUE_NAME, RABBITMQ_QUEUE_LOGS } = require("../../constants/app_constants");

module.exports.InstagramAuthorize = async (req, res) => {
    const { email, reference_number, operation_type, client_type } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ success: false, error: true, message: errors.array() });
        return;
    }

    const hashLength = 32;
    const state = generateRandomHash(hashLength);
    if (!client_type.trim() || (client_type.trim() !== "web" && client_type.trim() !== "mobile")) {
        return res.status(400).json({ success: false, error: true, message: 'Missing client_type i.e. { web or mobile }.' });
    }

    try {
        // EXTREME SPEED: Overlap email/ref checks and the initial API call
        const [email_found, reference_number_found, resp] = await Promise.all([
            findUserCountByEmail(email),
            findUserCountByReferenceNumber(reference_number),
            igApiWithIgLogin(operation_type, state)
        ]);

        if (email_found === 0) {
            res.status(404).json({
                success: false,
                error: true,
                message: "Email not found."
            });
            return;
        }

        if (reference_number_found === 0) {
            res.status(404).json({
                success: false,
                error: true,
                message: "Reference number not found."
            });
            return;
        }

        console.log('EMBED URL ', resp);
        if (!resp[0]) {
            const payload = {
                channel_name: 'error_log',
                email: email,
                reference_number: reference_number,
                error_code: 400,
                error_message: `ERROR: ${resp[1]}`
            };
            sendMessageToQueue(RABBITMQ_QUEUE_LOGS, JSON.stringify(payload)).catch(e => console.error("RabbitMQ Log Error:", e));
            res.status(400).json({
                success: false,
                error: true,
                message: resp[1]
            });
            return;
        }

        // EXTREME SPEED: Run status checks in parallel
        const [accountExist, dateDifferenceInDays] = await Promise.all([
            getUserInstagramProfileExistByReferenceNumber(reference_number),
            calculateInstagramTokenExpiry(reference_number)
        ]);

        const route = req.originalUrl;
        const created_at = Date.now();
        const service = "ig";

        if (accountExist === 0 || accountExist === null) {
            if (operation_type === "deauthorize") {
                res.status(401).json({
                    success: false,
                    error: true,
                    message: 'You have not granted Project W-IG App access to your Instagram account..'
                });
                return;
            }
            await storeUserInstagramActivityLog({ reference_number, route, operation_type, client_type, service, state, created_at });
            if (client_type === "web") {
                res.redirect(resp[1]);
                return;
            }
            res.status(200).json({
                success: true,
                error: false,
                data: resp[1],
                message: 'You will be redirected to the Instagram login page shortly.'
            });
        } else {
            if (operation_type === "deauthorize") {
                await Promise.all([
                    deleteInstagramUserToken(reference_number),
                    deleteInstagramProfileData(reference_number)
                ]);
                res.status(401).json({
                    success: false,
                    error: true,
                    message: 'You have not granted Project W-IG App access to your Instagram account'
                });
                return;
            }
            await storeUserInstagramActivityLog({ reference_number, route, operation_type, client_type, service, created_at });
            if (client_type === "web") {
                res.redirect(resp[1]);
                return;
            }
            res.status(200).json({
                success: true,
                error: false,
                data: resp[1],
                message: 'You will be redirected back to your page shortly.'
            });
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            error: true,
            message: e?.message || 'Something wrong has happened'
        });
    }
};

