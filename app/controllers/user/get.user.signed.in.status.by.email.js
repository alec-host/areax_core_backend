const { db } = require("../../models");

const Users = db.users;

module.exports.getUserSignedInStatusCountByEmail = async(email) => {
    const count = await Users.count({where:{email:email,is_online:1}});
    return count;  
};
