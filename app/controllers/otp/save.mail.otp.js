const { db } = require("../../models");

const OTPs = db.otps;

module.exports.saveMailOtp = async (newOtp) => {
    try {
        await OTPs.create(newOtp);
        return true;
    } catch (err) {
        console.error('saveMailOtp Error:', err);
        return false;
    }
};
