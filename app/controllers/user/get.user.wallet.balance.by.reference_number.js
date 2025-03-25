const { db } = require("../../models");

const Wallets = db.wallets;

module.exports.getUserWalletByReferenceNumber = async(reference_number,callBack) => {
    await Wallets.findAll({attributes: ['credit_points_bought','bonus_points_earned','tier_reference_number','subscription_plan','expired_at','is_suspended','is_deleted'],
    where:{reference_number:reference_number,is_suspended:0,is_deleted:0}}).then((data) => {
        callBack(data);
    }).catch(e => {
        console.error(e);
        callBack([]);
    });
};
