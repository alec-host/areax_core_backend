const { db } = require("../../models");

const Users = db.users;

module.exports.getUserPasswordByEmail = (email) => {
    return new Promise((resolve, reject) => {
        Users.findOne({attributes: ['password','email_verified'], where:{email:email}}).then((data) => {
            console.log('data:  ',data.password,' ',data.email_verified);
            resolve([data.password,data.email_verified]);
        }).catch(e => { 
            console.error(e);
            resolve([]);
        });
    });
};
