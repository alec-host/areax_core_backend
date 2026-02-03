const { db2 } = require("../../../models");
const TikTokPersonDataModel = db2.pg_tiktok_user_data;

module.exports.calculateTiktokTokenExpiry = async (reference_number) => {
    try {
        const record = await TikTokPersonDataModel.findOne({
            where: { reference_number: reference_number },
            attributes: ['created_at']
        });

        if (record) {
            const createdAt = record ? record.created_at : null;
            if (createdAt) {
                const currentDate = Date.now();
                const differenceInDays = Math.floor((currentDate - new Date(createdAt).getTime()) / (24 * 60 * 60 * 1000));
                console.log('DATE DIFF IN DAYS', differenceInDays);
                return differenceInDays;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

