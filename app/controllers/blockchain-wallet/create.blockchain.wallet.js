const { db } = require("../../models");

const BlockchainWallets = db.blockchains;

module.exports.createBlockchainWallet = (payload) => {
    return new Promise((resolve, reject) => {
        BlockchainWallets.create(payload).then(() => {
            resolve([true,'Wallet account has been created.']);
        }).catch(err => {
            console.log(err);
            resolve([false,'Error occurred, Wallet creation has failed.']);
        });
    });
};
