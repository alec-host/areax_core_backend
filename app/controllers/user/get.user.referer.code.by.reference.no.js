const { db } = require("../../models");

const Users = db.users;

module.exports.getUserRefererCodeByReferenceNumber = (reference_number) => {
    return new Promise((resolve, reject) => {
        Users.findOne({attributes: ['referral_code'], where:{reference_number:reference_number}}).then((data) => {
            resolve(data.referral_code);
        }).catch(e => {
            console.error(e);
            resolve(null);
        });
    });
};
