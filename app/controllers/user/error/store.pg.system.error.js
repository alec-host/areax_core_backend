const { db2 } = require("../../../models");


module.exports.saveSystemErrors = async (payload, db_options = {}) => {
    const { transaction } = db_options;
    const SystemErrorsModel = db2.pg_system_errors;
    try {
        const savedUserData = await SystemErrorsModel.create(payload, { transaction });
        return savedUserData;
    } catch (err) {
        console.error('Error: failed to insert. ', err);
        return null;
    }
};

