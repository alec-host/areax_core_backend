const { db } = require("../../models");

const Users = db.users;
const PurgedUsers = db.users.purged;

module.exports.copyUserRecordByReferenceNo = async(reference_number) => {
    const user = await Users.findOne({where:{reference_number:reference_number}}).catch(e => { return false; });
    if(!user) {
        return false;
    }else{
        try{
            await PurgedUsers.create(user.toJSON());
        }catch(error){
            return false;
        }
    }
    return true;
};
