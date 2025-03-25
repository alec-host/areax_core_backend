const { db2 } = require("../../models");

const Instagrams = db2.instagrams;

module.exports.getUserInstagramIdByReferenceNo = (reference_number) => {
    return new Promise((resolve, reject) => {
        Instagrams.findOne({attributes: ['_profile_data'], where:{reference_number:reference_number}}).then((data) => {
            resolve(data?._profile_data);
        }).catch(e => { 
            console.error(e);
            resolve([]);
        });
    });
};