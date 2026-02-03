const { db2 } = require("../../../models");
const InstagramUserDataModel = db2.pg_ig_user_data;

module.exports.getUserInstagramProfileExistByReferenceNumber = async (reference_number) => {
    try {
        const count = await InstagramUserDataModel.count({
            where: {
                reference_number: reference_number,
                is_revoked: false,
                is_deleted: false
            }
        });
        return count;
    } catch (err) {
        console.error('ERROR: ', err);
        return null;
    }
};

