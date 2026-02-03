const { db } = require("../../../models");
const InstagramUserDataModel = db.pg_ig_user_data;

module.exports.saveInstagramUserData = async (payload) => {
    try {
        const savedUserData = await InstagramUserDataModel.create(payload);
        return savedUserData;
    } catch (err) {
        console.error('Error: failed to insert. ', err);
        return null;
    }
};

module.exports.modifyInstagramUserData = async (reference_number, payload) => {
    try {
        const [result, created] = await InstagramUserDataModel.upsert({
            ...payload,
            reference_number: reference_number
        });
        return result !== null;
    } catch (err) {
        console.error('Error: failed to update. ', err);
        return null;
    }
};

