const { db } = require("../../models");
const Referrals = db.referrals;

/**
 * Retrieves all referrals with pagination for admin.
 */
module.exports.getAllReferrals = async (page = 1, limit = 10) => {
    // Defensive check: Ensure limit doesn't exceed 100 and page is at least 1
    const safeLimit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    const safePage = Math.max(parseInt(page) || 1, 1);
    const offset = (safePage - 1) * safeLimit;

    const { count, rows } = await Referrals.findAndCountAll({
        limit: safeLimit,
        offset: offset,
        order: [['created_at', 'DESC']]
    });

    return {
        totalItems: count,
        referrals: rows,
        totalPages: Math.ceil(count / safeLimit),
        currentPage: safePage
    };
};

