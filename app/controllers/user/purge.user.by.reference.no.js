const { db } = require("../../models");

const Users = db.users;

module.exports.deleteUserByReferenceNo = async(reference_number) => {
    const deletedRow = await Users.destroy({where:{reference_number:reference_number}}).catch(e => { return false; });
    if(deletedRow > 0) {
        return true;
    }
    return false;
};
