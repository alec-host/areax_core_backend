const { db2 } = require("../../models");
const UserLocationModel = db2.pg_user_locations;
const { mapSequelizePagination } = require("../../utils/pagination.mapper");

module.exports.getUsersLocationList = async (page = 1, limit = 10, filter = {}) => {
    try {
        // Translate MongoDB filter if necessary, or pass through if already compatible
        const where = filter;

        const result = await UserLocationModel.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit),
            order: [['updated_at', 'ASC']],
            attributes: ['_id', 'reference_number', 'lat', 'lng', 'updated_at']
        });

        return mapSequelizePagination(result, parseInt(page), parseInt(limit));
    } catch (err) {
        console.error('Error: failed to retrieve. ', err);
        return null;
    }
};

