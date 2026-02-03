const { db } = require("../../models");
const { Op } = require("sequelize");

const Referrals = db.referrals;

/**
 * Finds an active (non-withdrawn) referral invite for a contact across ALL referrers.
 * This ensures a contact cannot be actively invited by multiple users simultaneously.
 */
module.exports.findActiveInviteByContact = async (invitee_email, invitee_mobile_number, transaction = null) => {
    const where = {
        status: { [Op.ne]: 'withdrawn' }
    };

    const orConditions = [];
    if (invitee_email) {
        orConditions.push({ invitee_email });
    }
    if (invitee_mobile_number) {
        orConditions.push({ invitee_mobile_number });
    }

    if (orConditions.length === 0) return null;

    where[Op.or] = orConditions;

    return await Referrals.findOne({
        where,
        transaction
    });
};
