const axios = require('axios');
const FormData = require('form-data');
const { validationResult } = require('express-validator');
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { DATABASE_DIALECT } = require('../../constants/app_constants');
const locationService = (DATABASE_DIALECT && DATABASE_DIALECT !== 'mongo')
    ? require("../user/pg.user.location.by.reference.no")
    : require("../user/mongo.user.location.by.reference.no");

module.exports.UpdateUserLocation = async (req, res) => {
    const { email, reference_number, lat, lng } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ success: false, error: true, message: errors.array() });
        return;
    }
    try {
        const email_found = await findUserCountByEmail(email);
        if (email_found === 0) {
            res.status(404).json({
                success: false,
                error: true,
                message: "Email not found."
            });
            return;
        }
        const reference_number_found = await findUserCountByReferenceNumber(reference_number);
        if (reference_number_found === 0) {
            res.status(404).json({
                success: false,
                error: true,
                message: "Reference number not found."
            });
            return;
        }
        /*		
            let data = new FormData();
                data.append('_id', 10000000);
                data.append('reference_number', reference_number);
                data.append('lat', lat);
                data.append('lng', lng);
                data.append('updated_at', Date.now);
            */
        await locationService.upsertUserLocationData({ reference_number, lat, lng });
        res.status(200).json({
            success: true,
            error: false,
            message: "User coordinates lat,lng has been updated"
        });
    } catch (e) {
        if (e) {
            res.status(500).json({
                success: false,
                error: true,
                message: e?.response?.message || 'Something wrong has happened'
            });
        }
    }
};

