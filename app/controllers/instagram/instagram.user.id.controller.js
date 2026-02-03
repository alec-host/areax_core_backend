const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { DATABASE_DIALECT } = require("../../constants/app_constants");

const { getInstagramIdByReferenceNo } = (DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo')
    ? require("../user/instagram/get.pg.instagram.id.by.reference.no")
    : require("../user/instagram/get.mongo.instagram.id.by.reference.no");

exports.GetInstagramUserId = async (req, res) => {
    const reference_number = req.query.reference_number;
    const email = req.query.email;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, error: true, message: errors.array() });
    }
    try {
        // EXTREME SPEED: Run existence checks and ID retrieval in parallel
        const [email_found, reference_number_found, igId] = await Promise.all([
            findUserCountByEmail(email),
            findUserCountByReferenceNumber(reference_number),
            getInstagramIdByReferenceNo(reference_number)
        ]);

        if (email_found === 0) {
            res.status(404).json({
                success: false,
                error: true,
                message: 'Email not found.'
            });
            return;
        }
        if (reference_number_found === 0) {
            res.status(404).json({
                success: false,
                error: true,
                message: 'Reference number not found.'
            });
            return;
        }

        if (igId) {
            res.status(200).json({
                success: true,
                error: false,
                user_id: igId,
                message: 'User found'
            });
            return;
        }
        res.status(404).json({
            success: false,
            error: true,
            user_id: null,
            message: 'User not found'
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: true,
            message: e?.message || 'Something wrong has happened'
        });
    }
};

