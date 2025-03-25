const { db } = require("../../models");

const Wallets = db.wallets;

module.exports.createUserWallet = (newUserWallet) => {
    return new Promise((resolve, reject) => {
        Wallets.create(newUserWallet).then(() => {
            resolve([true,'User wallet has been created.']);
        }).catch(err => {
            console.log(err);
            resolve([false,'Error occurred, user wallet creation has failed.']);
        });
    });
};

