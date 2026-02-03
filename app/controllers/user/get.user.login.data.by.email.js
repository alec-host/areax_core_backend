const { db } = require("../../models");

const Users = db.users;

module.exports.getUserLoginDataByEmail = async (email) => {
    try {
        const user = await Users.findOne({
            where: { email: email },
            attributes: [
                'password', 'email_verified', 'reference_number', '_id',
                'username', 'email', 'phone', 'country_code', 'display_name',
                'profile_picture_url', 'caption', 'guardian_picture_url',
                'token_id', 'country', 'city', 'tier_reference_number',
                'privacy_status', 'phone_verified', 'created_at'
            ]
        });
        return user;
    } catch (e) {
        console.error('getUserLoginDataByEmail Error:', e);
        return null;
    }
};

