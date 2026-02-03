const { db2 } = require("../../../models");


module.exports.saveUserWalletTransaction = async (transactionData, db_options = {}) => {
    const { transaction } = db_options;
    const UserWalletTransaction = db2.pg_wallet_transactions;
    try {
        const savedTransactionData = await UserWalletTransaction.create(transactionData, { transaction });
        return savedTransactionData;
    } catch (err) {
        console.error('Error: failed to insert. ', err);
        return null;
    }
};

