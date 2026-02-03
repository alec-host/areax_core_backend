const { db2 } = require("../../../models");


module.exports.retrieveTikTokProfileByReferenceNumber = async (reference_number) => {
    try {
        const TikTokPersonDataModel = db2.pg_tiktok_user_data;
        const records = await TikTokPersonDataModel.findAll({
            where: { reference_number: reference_number },
            attributes: ['open_id', 'union_id', 'display_name', 'avatar_url', 'profile_deep_link', 'bio_description']
        });
        return records || null;
    } catch (err) {
        console.error('Error: failed to retrieve records. ', err);
        return null;
    }
};

