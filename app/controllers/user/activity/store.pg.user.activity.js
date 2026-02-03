const { db2 } = require("../../../models");


module.exports.saveUserActivityData = async (payload, db_options = {}) => {
    const { transaction } = db_options;
    const UserActivitiesModel = db2.pg_user_activities;
    try {
        const savedUserData = await UserActivitiesModel.create(payload, { transaction });
        return savedUserData;
    } catch (err) {
        console.error('Error: failed to insert. ', err);
        return null;
    }
};

