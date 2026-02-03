const { db2 } = require("../../../models");


module.exports.saveTikTokUserProfile = async (payload, db_options = {}) => {
    const { transaction } = db_options;
    const TikTokPersonDataModel = db2.pg_tiktok_user_data;
    try {
        const [result, created] = await TikTokPersonDataModel.upsert({
            reference_number: payload.reference_number,
            display_name: payload.display_name,
            open_id: payload.open_id,
            profile_deep_link: payload.profile_deep_link,
            union_id: payload.union_id,
            avatar_url: payload.avatar_url,
            bio_description: payload.bio_description
        }, { transaction });

        return result;
    } catch (err) {
        console.error('Error: failed to upsert. ', err);
        return null;
    }
};

