const { db } = require("../../models");

const OTPs = db.otps;

module.exports.confirmMailOtp = async(confirmOtp,email) => {
    const otp = await OTPs.findOne({where:{message:confirmOtp,email:email},order:[['_id', 'DESC']],limit:1}).catch(e => { return false; });
    if(!otp) {
        return false;
    }
    return true;
};