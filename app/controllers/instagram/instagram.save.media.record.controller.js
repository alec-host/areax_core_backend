const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { DATABASE_DIALECT } = require('../../constants/app_constants');
const mediaStoreService = (DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo')
    ? require("../user/instagram/store.retrieve.pg.instagram.media")
    : require("../user/instagram/store.retrieve.mongo.instagram.media");

exports.SaveInstagramMediaRecord = async (req, res) => {
    const { email, reference_number, media_data } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, error: true, message: errors.array() });
    }
    try {
        // EXTREME SPEED: Overlap existence checks and media storage
        const [email_found, reference_number_found, record] = await Promise.all([
            findUserCountByEmail(email),
            findUserCountByReferenceNumber(reference_number),
            mediaStoreService.saveInstagramMediaRecord(media_data)
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

        if (record) {
            res.status(200).json({
                success: true,
                error: false,
                data: record,
                message: 'Media record has been saved.'
            });
            return;
        }
        res.status(400).json({
            success: false,
            error: true,
            data: null,
            message: 'No media record has been saved'
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            error: true,
            message: e?.message || 'Something wrong has happened'
        });
    }
};

