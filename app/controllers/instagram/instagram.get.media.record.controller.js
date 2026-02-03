const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { DATABASE_DIALECT } = require("../../constants/app_constants");

const { retrieveInstagramMediaByReferenceNumber } = (DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo')
    ? require("../user/instagram/store.retrieve.pg.instagram.media")
    : require("../user/instagram/store.retrieve.mongo.instagram.media");

exports.RetrieveInstagramMediaRecords = async (req, res) => {
    const email = req.query.email;
    const reference_number = req.query.reference_number;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ success: false, error: true, message: errors.array() });
    }
    const email_found = await findUserCountByEmail(email);
    if (email_found === 0) {
        res.status(404).json({
            success: false,
            error: true,
            message: 'Email not found.'
        });
        return;
    }
    const reference_number_found = await findUserCountByReferenceNumber(reference_number);
    if (reference_number_found === 0) {
        res.status(404).json({
            success: false,
            error: true,
            message: 'Reference number not found.'
        });
        return;
    }
    const record = await retrieveInstagramMediaByReferenceNumber(reference_number);
    if (record && record.length > 0) {
        res.status(200).json({
            success: true,
            error: false,
            data: record,
            message: 'Instagram media record(s)'
        });
        return;
    }
    res.status(404).json({
        success: false,
        error: true,
        data: null,
        message: 'No record(s) found'
    });
};

