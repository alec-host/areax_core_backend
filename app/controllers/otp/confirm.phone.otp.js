const { db } = require("../../models");

const OTPs = db.otps;

module.exports.confirmPhoneOtp = async(confirmOtp,phone) => {
    const otp = await OTPs.findOne({where:{message:confirmOtp,phone:phone},order:[['_id', 'DESC']],limit:1}).catch(e => { return false; });
    if(!otp) {
        return false;
    }
    return true;
};
