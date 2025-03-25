const { db } = require("../../models");

const Users = db.users;

module.exports.getReferenceNumberByEmail = (email) => {
    return new Promise((resolve, reject) => {
        Users.findOne({attributes: ['reference_number'], where:{email:email}}).then((data) => {
            resolve(data.reference_number);
        }).catch(e => {
            console.error(e);
            resolve([]);
        });
    });
};

