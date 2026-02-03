const { db2 } = require("../../../models");


module.exports.saveTikTokUserToken = async (payload, db_options = {}) => {
    const { transaction } = db_options;
    const TikTokTokenModel = db2.pg_tiktok_tokens;
    try {
        const [result, created] = await TikTokTokenModel.upsert({
            reference_number: payload.reference_number,
            access_token: payload.access_token,
            refresh_token: payload.refresh_token,
            open_id: payload.open_id,
            scope: payload.scope,
            expires_in: payload.expires_in
        }, { transaction });

        return result;
    } catch (err) {
        console.error('Error: failed to upsert token. ', err);
        return null;
    }
};

