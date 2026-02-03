const { db } = require("../../../models");
const UserWalletTransaction = db.pg_wallet_transactions;
const { mapSequelizePagination } = require("../../../utils/pagination.mapper");

module.exports.getUserWalletTransaction = async (page = 1, limit = 10, referenceNumber = '') => {
    try {
        const where = {};
        if (referenceNumber) {
            where.reference_number = referenceNumber;
        }

        const result = await UserWalletTransaction.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
            order: [['created_at', 'DESC']]
        });

        return mapSequelizePagination(result, parseInt(page), parseInt(limit));
    } catch (err) {
        console.error('Error: failed to retrieve. ', err);
        return null;
    }
};

