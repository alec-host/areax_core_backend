const { db } = require("../../models");
const { Op } = require("sequelize");

const Referrals = db.referrals;

module.exports.getReferralSummaryByReferrerId = async (referrer_id) => {
    const INVITE_LIMIT = 5;

    // 1. Get all invites that are NOT withdrawn (these are the ones occupying the 5 slots)
    const activeInvitesList = await Referrals.findAll({
        where: {
            referrer_id,
            status: { [Op.ne]: 'withdrawn' }
        },
        attributes: ['status']
    });

    const invites_sent = activeInvitesList.length;
    const invites_remaining = Math.max(0, INVITE_LIMIT - invites_sent);

    // 2. Status breakdown for active/vaild invites only
    const status_breakdown = {};
    activeInvitesList.forEach(item => {
        status_breakdown[item.status] = (status_breakdown[item.status] || 0) + 1;
    });

    return {
        invites_limit: INVITE_LIMIT,
        invites_sent,
        invites_remaining,
        status_breakdown
    };
};

