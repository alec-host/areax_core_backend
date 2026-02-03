const { db } = require("../../models");
const { Op } = require("sequelize");

const Referrals = db.referrals;

module.exports.countActiveReferralInvites = async (referrer_id, transaction = null) => {
    const options = {
        where: {
            referrer_id,
            status: { [Op.ne]: 'withdrawn' }
        }
    };
    if (transaction) options.transaction = transaction;

    const count = await Referrals.count(options);
    return count;
};

