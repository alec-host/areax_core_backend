const { db } = require("../../models");

const Users = db.users;

module.exports.getUserTokenIdByEmail = (email) => {
    return new Promise((resolve, reject) => {
        Users.findOne({attributes: ['token_id','hashed_token_id'], where:{email:email}}).then((data) => {
            const token_id = data.token_id;
            const hashed_token_id = data.hashed_token_id;		
            resolve({ token_id, hashed_token_id });
        }).catch(e => { 
            console.error(e);
            resolve([]);
        });
    });
};
