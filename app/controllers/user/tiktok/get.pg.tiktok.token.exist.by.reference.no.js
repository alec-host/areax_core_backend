const { db2 } = require("../../../models");


module.exports.tiktokTokenExistByReferenceNo = async (reference_number) => {
    try {
        const TikTokTokenModel = db2.pg_tiktok_tokens;
        const userRecord = await TikTokTokenModel.findOne({
            where: { reference_number: reference_number },
            attributes: ['_id']
        });
        return userRecord ? 1 : 0;
    } catch (err) {
        console.error('Error: ', err);
        return 0;
    }
};

