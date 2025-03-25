const { db2 } = require("../../../models");

const InstagramActivityLogs = db2.instagrams.activities;

module.exports.storeUserInstagramActivityLog = (newData) => {
    return new Promise((resolve,reject) => {
        InstagramActivityLogs.create(newData).then(() => {
            resolve([true,"User's Instagram activity log has been saved."]);
        }).catch(err => {
            console.log(err);
            resolve([false,"Error occurred, user's Instagram activity log has not been saved."]);
        });
    });
};