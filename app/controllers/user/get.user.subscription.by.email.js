const { db } = require("../../models");

const Users = db.users;

module.exports.getUserSubscriptionPlanByEmail = (email) => {
    return new Promise((resolve, reject) => {
        Users.findOne({attributes: ['tier_reference_number'], where:{email:email}}).then((data) => {
            resolve(data.tier_reference_number);
        }).catch(e => {
            console.error(e);
            resolve([]);
        });
    });
};
