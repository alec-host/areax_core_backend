const { db } = require("../../models");

const Users = db.users;

module.exports.createUser = (newUser) => {
    return new Promise((resolve, reject) => {
        Users.create(newUser).then(() => {
            resolve([true,'User account has been created.']);
        }).catch(err => {
            console.log(err);
            resolve([false,'Error occurred, user creation has failed.']);
        });
    });
};
