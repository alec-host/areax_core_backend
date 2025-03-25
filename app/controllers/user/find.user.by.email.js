const { db } = require("../../models");

const Users = db.users;

module.exports.findUserByEmail = async(email) => {
    const user = await Users.findOne({where:{email:email}}).catch(e => { return false; });
    if(!user) {
        return false;
    }
    return user;
};
