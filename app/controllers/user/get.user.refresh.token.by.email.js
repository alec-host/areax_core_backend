const { db } = require("../../models");

const Users = db.users;

module.exports.getUserRefreshTokenByEmail = (email) => {
    return new Promise((resolve, reject) => {
        Users.findOne({attributes: ['refresh_token'], where:{email:email}}).then((data) => {
            resolve(data.refresh_token);
        }).catch(e => { 
            console.error(e);
            resolve([]);
        });
    });
};
