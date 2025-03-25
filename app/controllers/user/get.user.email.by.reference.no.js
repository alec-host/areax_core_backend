const { db } = require("../../models");

const Users = db.users;

module.exports.getUserEmailByReferenceNumber = (reference_number) => {
    return new Promise((resolve, reject) => {
        Users.findOne({attributes: ['email'], where:{reference_number:reference_number}}).then((data) => {
            console.log('data:  ',data.email);
            resolve([data.email]);
        }).catch(e => {
            console.error(e);
            resolve([]);
        });
    });
};
