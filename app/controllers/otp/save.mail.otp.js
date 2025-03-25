const { db } = require("../../models");

const OTPs = db.otps;

module.exports.saveMailOtp = async(newOtp) => {
    await OTPs.create(newOtp).then(data => {
        return true;  
    }).catch(err => {
        return false;  
    });
};