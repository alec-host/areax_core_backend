const { db2 } = require("../../../models");
const InstagramUserDataModel = db2.pg_ig_user_data;

module.exports.getUserInstagramProfileByReferenceNo = async (reference_number) => {
    try {
        const user = await InstagramUserDataModel.findOne({
            where: { reference_number: reference_number },
            attributes: ['name', 'username', 'account_type', 'profile_picture_url', 'followers_count', 'follows_count', 'media_count']
        });
        return user || null;
    } catch (err) {
        console.error('Error: ', err);
        return null;
    }
};

