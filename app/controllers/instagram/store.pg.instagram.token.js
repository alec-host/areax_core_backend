const { db } = require("../../../models");
const InstagramTokenModel = db.pg_ig_tokens;
const InstagramUserDataModel = db.pg_ig_user_data;

module.exports.saveInstagramUserToken = async (payload) => {
    try {
        const savedToken = await InstagramTokenModel.create(payload);
        return savedToken;
    } catch (err) {
        console.error('Error: failed to insert. ', err.message);
        return null;
    }
};

module.exports.updateInstagramUserToken = async (reference_number, payload) => {
    try {
        const [result, created] = await InstagramTokenModel.upsert({
            ...payload,
            reference_number: reference_number
        });
        return result !== null;
    } catch (err) {
        console.error('Error: failed to update. ', err);
        return null;
    }
};

module.exports.revokeInstagramUserToken = async (payload) => {
    try {
        const deleteTokenResult = await InstagramTokenModel.destroy({ where: payload });
        const deleteUserDataResult = await InstagramUserDataModel.destroy({ where: payload });
        return [true, 'Instagram access has been revoked'];
    } catch (err) {
        console.error('Error: failed to delete. ', err);
        return [false, 'Error: failed to delete'];
    }
};

