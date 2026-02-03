const { db2 } = require("../../models");
const UserLocationModel = db2.pg_user_locations;

module.exports.upsertUserLocationData = async (payload, db_options = {}) => {
    const { transaction } = db_options;
    try {
        const [result, created] = await UserLocationModel.upsert({
            reference_number: payload.reference_number,
            lat: payload.lat,
            lng: payload.lng
        }, { transaction });

        return result;
    } catch (err) {
        console.error('Error: failed to upsert. ', err);
        return null;
    }
};

