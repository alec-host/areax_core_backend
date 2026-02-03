const { db } = require("../../models");

const Users = db.users;

module.exports.getUserProfileByEmail = async (email, callBack) => {
    try {
        const data = await Users.findAll({
            attributes: ['reference_number', 'username', 'email', 'phone', 'country_code', 'display_name', 'profile_picture_url',
                'caption', 'guardian_picture_url', 'token_id', 'country', 'city', 'tier_reference_number',
                'privacy_status', 'email_verified', 'phone_verified', 'created_at'],
            where: { email: email }
        });
        if (callBack) callBack(data);
        return data;
    } catch (e) {
        console.error(e);
        if (callBack) callBack([]);
        return [];
    }
};

