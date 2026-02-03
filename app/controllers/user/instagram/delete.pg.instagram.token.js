const { db2 } = require("../../../models");
const InstagramTokenModel = db2.pg_ig_tokens;

module.exports.deleteInstagramUserToken = async (reference_number, db_options = {}) => {
    const { transaction } = db_options;
    try {
        const result = await InstagramTokenModel.destroy({
            where: { reference_number: reference_number },
            transaction
        });
        return result > 0;
    } catch (err) {
        console.error('Error: failed to delete token. ', err);
        return false;
    }
};

