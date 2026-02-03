const { db } = require("../../models");

const Referrals = db.referrals;

module.exports.findReferralByCode = async (referral_code, transaction = null) => {
    const options = { where: { referral_code } };
    if (transaction) options.transaction = transaction;

    const referral = await Referrals.findOne(options);
    return referral;
};

