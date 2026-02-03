const { db2 } = require("../../../models");
const InstagramUserDataModel = db2.pg_ig_user_data;

module.exports.deleteInstagramProfileData = async (reference_number, db_options = {}) => {
    const { transaction } = db_options;
    try {
        const result = await InstagramUserDataModel.destroy({
            where: { reference_number: reference_number },
            transaction
        });
        return result > 0;
    } catch (err) {
        console.error('Error: failed to delete profile data. ', err);
        return false;
    }
};

