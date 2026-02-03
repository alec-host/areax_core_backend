const { db2 } = require("../../../models");


module.exports.saveReceiptData = async (payload, db_options = {}) => {
    const { transaction } = db_options;
    const ReceiptDataModel = db2.pg_receipts;
    try {
        const savedReceiptData = await ReceiptDataModel.create(payload, { transaction });
        return savedReceiptData;
    } catch (err) {
        console.error('Error: failed to insert. ', err);
        return null;
    }
};
