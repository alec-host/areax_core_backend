const { db2 } = require("../../../models");


module.exports.saveInstagramUserData = async (payload) => {
    try {
        const InstagramUserDataModel = db2.pg_ig_user_data;
        const savedUserData = await InstagramUserDataModel.create(payload);
        return savedUserData;
    } catch (err) {
        console.error('Error: failed to insert. ', err);
        return null;
    }
};

module.exports.modifyInstagramUserData = async (reference_number, payload) => {
    try {
        const InstagramUserDataModel = db.pg_ig_user_data;
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

