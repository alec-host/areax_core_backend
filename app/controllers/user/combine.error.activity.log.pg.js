const { db2 } = require("../../models");
const UserActivitiesModel = db2.pg_user_activities;
const SystemErrorsModel = db2.pg_system_errors;

module.exports.combinedErrorActivityData = async (payload) => {
    try {
        const { page, limit, search } = payload;
        const offset = (page - 1) * limit;

        const userActivities = await UserActivitiesModel.findAll({
            where: search,
            attributes: ['reference_number', 'email', 'activity_name', 'time_stamp'],
            limit: parseInt(limit),
            offset: offset,
            raw: true
        });

        const systemErrors = await SystemErrorsModel.findAll({
            where: search,
            attributes: ['reference_number', 'email', 'error_code', 'error_message', 'time_stamp'],
            limit: parseInt(limit),
            offset: offset,
            raw: true
        });

        const combinedResults = [
            ...userActivities.map(record => ({
                reference_number: record.reference_number,
                email: record.email,
                activity_description: record.activity_name,
                timestamp: record.time_stamp
            })),
            ...systemErrors.map(record => ({
                reference_number: record.reference_number,
                email: record.email,
                activity_description: `ERROR: ${record.error_code} - ${record.error_message}`,
                timestamp: record.time_stamp
            }))
        ];

        const optimizedResults = combinedResults
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, parseInt(limit));

        return optimizedResults;
    } catch (err) {
        console.error('Error: ', err.message);
        return null;
    }
}; 

