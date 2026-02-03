const { db2 } = require("../../../models");


module.exports.getInstagramIdByReferenceNo = async (reference_number) => {
    try {
        const InstagramUserDataModel = db2.pg_ig_user_data;
        const userRecord = await InstagramUserDataModel.findOne({
            where: { reference_number: reference_number },
            attributes: ['user_id']
        });
        return userRecord ? userRecord.user_id : null;
    } catch (err) {
        console.error('Error: ', err);
        return null;
    }
};

