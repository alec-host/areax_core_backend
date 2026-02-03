const { db } = require("../../models");

const Referrals = db.referrals;

module.exports.createReferralInvite = async (data, transaction = null) => {
    const options = {};
    if (transaction) options.transaction = transaction;

    const referral = await Referrals.create(data, options);
    return referral;
};

