const { db2 } = require("../../../models");


module.exports.getTikTokAccessTokenByReferenceNumber = async (reference_number) => {
    try {
        const TikTokTokenModel = db2.pg_tiktok_tokens;
        const records = await TikTokTokenModel.findOne({
            where: { reference_number: reference_number },
            attributes: ['access_token', 'refresh_token']
        });
        return records || null;
    } catch (err) {
        console.error('Error: failed to retrieve records. ', err);
        return null;
    }
};

