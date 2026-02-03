const { db2 } = require("../../../models");


module.exports.deleteTiktokProfileData = async (reference_number, db_options = {}) => {
    const { transaction } = db_options;
    const TikTokPersonDataModel = db2.pg_tiktok_user_data;
    try {
        const result = await TikTokPersonDataModel.destroy({
            where: { reference_number: reference_number },
            transaction
        });
        return result > 0;
    } catch (err) {
        console.error('Error: failed to delete profile data. ', err);
        return false;
    }
};

