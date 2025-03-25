const { db } = require("../../models");

const Users = db.users;

module.exports.modifyUserByPhone = async(phone,payload) => {
    const isUpdated = await Users.update(payload,{ where:{phone:phone}}).catch(e => { return false; });
    if(!isUpdated){
        return false;
    }
    return true;
};
