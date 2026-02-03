const { validationResult } = require("express-validator");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { DATABASE_DIALECT } = require("../../constants/app_constants");

const { getTikTokAccessTokenByReferenceNumber } = (DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo')
    ? require("../user/tiktok/get.pg.tiktok.token")
    : require("../user/tiktok/get.mongo.tiktok.token");

module.exports.GetTikTokToken = async (req, res) => {
    const { reference_number } = req.query;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        const reference_number_found = await findUserCountByReferenceNumber(reference_number);
        if (reference_number_found > 0) {
            const data = await getTikTokAccessTokenByReferenceNumber(reference_number);
            if (data) {
                res.status(200).json({
                    success: true,
                    error: false,
                    data: data,
                    message: 'TikTok token information'
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: true,
                    message: 'Something wrong has happened. Please try again'
                });
            }
        } else {
            res.status(404).json({
                success: false,
                error: true,
                message: 'Reference number not found'
            });
        }
    } else {
        res.status(422).json({ success: false, error: true, message: errors.array() });
    }
};

