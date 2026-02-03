const { db } = require("../../models");

const Referrals = db.referrals;

module.exports.getReferralInvitesByReferrerId = async (referrer_id) => {
    const invites = await Referrals.findAll({
        where: { referrer_id },
        attributes: ['referral_code', 'invitee_name', 'invitee_email', 'invitee_mobile_number', 'status', 'created_at'],
        order: [['created_at', 'DESC']]
    });
    return invites;
};

