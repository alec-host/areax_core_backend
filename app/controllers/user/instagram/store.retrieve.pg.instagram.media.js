const { db2 } = require("../../../models");
const InstagramMediaModel = db2.pg_ig_media;

module.exports.saveInstagramMediaRecord = async (payload, db_options = {}) => {
    const { transaction } = db_options;
    try {
        const savedMediaData = await InstagramMediaModel.create(payload, { transaction });
        return savedMediaData;
    } catch (err) {
        console.error('Error: failed to insert. ', err.message);
        return null;
    }
};

module.exports.retrieveInstagramMediaByReferenceNumber = async (reference_number) => {
    try {
        const records = await InstagramMediaModel.findAll({
            where: { reference_number: reference_number, is_deleted: false },
            attributes: ['reference_number', 'id', 'user_id', 'media_type', 'media_url', 'caption', 'permalink', 'like_count', 'comments_count', 'is_minted', 'created_at', 'is_deleted'],
            order: [['created_at', 'DESC']],
            limit: 500
        });
        return records || null;
    } catch (err) {
        console.error('Error: failed to retrieve records. ', err);
        return null;
    }
};

