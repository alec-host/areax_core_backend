const { db } = require("../../models");

const Referrals = db.referrals;
const Users = db.users;

/**
 * Retrieves invitee details by referral code.
 * Uses a logical join (two separate queries) for scalability.
 */
module.exports.getInviteeDetailsByCode = async (code) => {
    // 1. Fetch the referral record
    const referral = await Referrals.findOne({
        where: { referral_code: code }
    });

    if (!referral) return null;

    let user_record = null;
    // 2. Logical join: Fetch user profile details only if they have signed up (referee_id exists)
    if (referral.referee_id) {
        user_record = await Users.findByPk(referral.referee_id, {
            attributes: ['username', 'display_name', 'profile_picture_url', 'is_online']
        });
    }

    return { referral, user_record };
};

