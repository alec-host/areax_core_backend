const { db2 } = require("../../../models");


module.exports.saveTiktokMediaRecord = async (payload, db_options = {}) => {
    const { transaction } = db_options;
    const TikTokMediaModel = db2.pg_tiktok_media;
    try {
        const savedMediaData = await TikTokMediaModel.create(payload, { transaction });
        return savedMediaData;
    } catch (err) {
        console.error('Error: failed to insert. ', err.message);
        return null;
    }
};

module.exports.retrieveTiktokMediaByReferenceNumber = async (reference_number) => {
    try {
        const TikTokMediaModel = db2.pg_tiktok_media;
        const records = await TikTokMediaModel.findAll({
            where: { reference_number: reference_number, is_deleted: false },
            attributes: ['reference_number', 'user_id', 'publish_id', 'upload_url', 'title', 'caption', 'like_count', 'comments_count', 'is_minted', 'created_at', 'is_deleted'],
            order: [['created_at', 'DESC']],
            limit: 500
        });
        return records || null;
    } catch (err) {
        console.error('Error: failed to retrieve records. ', err);
        return null;
    }
};

