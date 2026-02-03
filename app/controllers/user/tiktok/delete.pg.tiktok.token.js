const { db2 } = require("../../../models");


module.exports.deleteTiktokUserToken = async (reference_number, db_options = {}) => {
    const { transaction } = db_options;
    const TikTokTokenModel = db2.pg_tiktok_tokens;
    try {
        const result = await TikTokTokenModel.destroy({
            where: { reference_number: reference_number },
            transaction
        });
        return result > 0;
    } catch (err) {
        console.error('Error: failed to delete token. ', err);
        return false;
    }
};

