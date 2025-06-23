const { db } = require("../../models");

const Users = db.users;

module.exports.modifyUserByEmail= async(payload) => {
    console.log('ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ ',payload);	
    const _status = payload.privacy_status;	
    const _email = payload.email;
    const isUpdated = await Users.update({ privacy_status: _status },{ where:{ email: _email }}).catch(e => { return false; });
    if(!isUpdated){
        return false;
    }
    return true;
};
