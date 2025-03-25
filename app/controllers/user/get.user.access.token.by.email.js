const { db } = require("../../models");

const Users = db.users;

module.exports.getUserAcessTokenByEmail = (email) => {
    return new Promise((resolve, reject) => {
        Users.findOne({attributes: ['access_token'], where:{email:email}}).then((data) => {
            resolve(data.access_token);
        }).catch(e => { 
            console.error(e);
            resolve([]);
        });
    });
};
