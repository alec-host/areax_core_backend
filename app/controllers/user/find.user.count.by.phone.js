const { db } = require("../../models");

const Users = db.users;

module.exports.findUserCountByPhone = async(phone) => {
    const count = await Users.count({where:{phone:phone}});
    return count;  
};