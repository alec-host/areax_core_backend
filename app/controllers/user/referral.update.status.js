const { db } = require("../../models");

module.exports.updateReferralStatusById = async (_id, status, transaction = null) => {
    const options = { where: { _id } };
    if (transaction) options.transaction = transaction;

    const [updated] = await db.referrals.update({ status }, options);
    return updated > 0;
};

