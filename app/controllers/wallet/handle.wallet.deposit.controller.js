const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { depositByReferenceNumber } = require("../user/update.wallet.balance.by.reference.no");
const { saveUserWalletTransaction } = require('../user/accounts/store.mongo.wallet.transactions');
const { saveDepositTransaction  } = require('../user/accounts/store.mongo.deposit.transactions');

module.exports.HandleWalletDeposit = async(req,res) => {
    const { email,reference_number,amount } = req.body; 	
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const email_found = await findUserCountByEmail(email);
            if(email_found > 0){
                const reference_number_found = await findUserCountByReferenceNumber(reference_number);
                if(reference_number_found > 0){
		    const purchased_credit = amount;	
		    const response = await depositByReferenceNumber(reference_number,purchased_credit);	
		    if(response[0]){
			 console.log('XXXXXXX------> ', response,'  ',purchased_credit);
			 const walletTransaction  = {  
		             reference_number: reference_number,
			     dr: purchased_credit,
			     running_balance: 0.00, 
			     particular: `A DEPOSIT OF ${purchased_credit} POINTS COSTING ${amount} HAS BEEN DEBITED TO YOUR WALLET A/C` 
			 };   
			 await saveUserWalletTransaction(walletTransaction);   
			 const depositTransaction = { 
			     reference_number: reference_number,
			     cr: purchased_credit,
			     running_balance: 0.00, 
			     particular: `A DEPOSIT OF ${purchased_credit} HAS BEEN MADE BY ${reference_number}`
			 }
	                 await saveDepositTransaction(depositTransaction);
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
