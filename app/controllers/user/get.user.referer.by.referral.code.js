const { db } = require("../../models");

const Users = db.users;

module.exports.getUserRefererByReferralCode = (referral_code) => {
    return new Promise((resolve, reject) => {
        Users.findOne({attributes: ['reference_number'], where:{referral_code}}).then((data) => {
            resolve(data.reference_number);
        }).catch(e => {
            console.error(e);
            resolve(null);
        });
    });
};
