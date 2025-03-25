const { db } = require("../../models");

const Wallet = db.wallets;

module.exports.addWalletBalanceByReferenceNumber = async(reference_number,payload) => {
    try{
        const [wallet, created] = await Wallet.findOrCreate({
            where: { reference_number: reference_number },
            defaults: {
                amount: payload.amount,
                credit_points_bought: payload.credit_points_bought,
                tier_reference_number: payload.tier_reference_number,
                subscription_plan: payload.subscription_plan,
                expired_at: payload.expired_at
            }
        });

        if(!created){
            wallet.amount = payload.amount;
            wallet.credit_points_bought += payload.credit_points_bought;
            wallet.tier_reference_number = payload.tier_reference_number;
            wallet.subscription_plan = payload.subscription_plan;
            wallet.expired_at = payload.expired_at;
            wallet.save();
        }
        return true;
    }catch(error){
        console.error(`ERROR:  ${error} `);
        return false;
    }
};
