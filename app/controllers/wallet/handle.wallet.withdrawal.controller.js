const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { withdrawByReferenceNumber } = require("../user/update.wallet.balance.by.reference.no");
const { saveUserWalletTransaction } = require('../user/accounts/store.mongo.wallet.transactions');
const { saveDepositTransaction  } = require('../user/accounts/store.mongo.deposit.transactions');
const { saveUtilityTransaction  } = require('../user/accounts/store.mongo.utility.transactions');

module.exports.HandleWalletWithdraw = async(req,res) => {
    const { email,reference_number,used_credits } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const email_found = await findUserCountByEmail(email);
            if(email_found > 0){
                const reference_number_found = await findUserCountByReferenceNumber(reference_number);
                if(reference_number_found > 0){
                    const response = await withdrawByReferenceNumber(reference_number,used_credits);
                    if(response[0]){
                         const walletTransaction  = {
                             reference_number: reference_number,
                             cr: used_credits,
                             running_balance: 0.00,
                             particular: `USAGE OF ${used_credits} POINTS HAS BEEN CREDITED TO YOUR WALLET A/C WHICH IS IDENTIFIED BY REF_NO: ${reference_number}`
                         };
			 await saveUserWalletTransaction(walletTransaction);   
                         const depositTransaction = {
                             reference_number: reference_number,
                             dr: used_credits,
                             running_balance: 0.00,
                             particular: `WITHDRAWAL OF ${used_credits} HAS BEEN MADE BY USER IDENTIFIED BY REF_NO: ${reference_number}`
                         };
			 await saveDepositTransaction(depositTransaction);   
                         const utilityTransaction = {
                             reference_number: reference_number,
                             dr: used_credits,
                             running_balance: 0.00,
                             particular: `${used_credits} POINTS HAS BEEN SPENT BY USER IDENTIFIED BY REF_NO: ${reference_number}`
                         };
			 await saveUtilityTransaction(utilityTransaction);   
                         res.status(200).json({
                            success: true,
                            error: false,
                            message: response[1]
                         });
                    }else{
                        res.status(400).json({
                            success: false,
                            error: true,
                            message: response[1]
                        });
                    }
	         }else{
                    res.status(404).json({
                        success: false,
                        error: true,
                        message: "Reference number not found."
                    });
                }
            }else{
                res.status(404).json({
                    success: false,
                    error: true,
                    message: "Email not found."
                });
            }
        }catch(e){
            if(e){
                res.status(500).json({
                    success: false,
                    error: true,
                    message: e?.response?.message || 'Something wrong has happened'
                });
            }
        }
    }else{
        res.status(422).json({errors: errors.array()});
    }
};
