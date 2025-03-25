const { db } = require("../../models");

const blockchainWallet = db.blockchains;

module.exports.findBlockchainWalletByReferenceNumber = async(reference_number) => {
    const count = await blockchainWallet.count({where:{reference_number:reference_number}});
    return count;  
};
