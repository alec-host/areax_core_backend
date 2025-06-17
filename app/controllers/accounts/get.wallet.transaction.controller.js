const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getUserWalletTransaction } = require("../user/accounts/get.mongo.wallet.transactions");

module.exports.GetWalletTransactions = async(req,res) => {
    const errors = validationResult(req);
    const email = req.query.email;
    const reference_number = req.query.reference_number;
    const page = req.query.page;
    const limit = req.query.limit;	
    if(!errors.isEmpty()){
	return res.status(422).json({success: false, error: true, message: errors.array()});    
    }
    try{
       const email_found = await findUserCountByEmail(email);
       if(email_found === 0){
          res.status(404).json({
              success: false,
              error: true,
              message: "Email not found."
          });
	  return;
       }
       const reference_number_found = await findUserCountByReferenceNumber(reference_number);
       if(reference_number_found === 0){
          res.status(404).json({
              success: false,
              error: true,
              message: "Reference number not found."
          });
	  return;     
       }
       const result = await getUserWalletTransaction(page,limit,reference_number);
       if(result){
          res.status(200).json({
              success: true,
              error: false,
              data: result,
              message: "Wallet transactions"
          });
	  return;
       }
       res.status(404).json({
           success: true,
           error: false,
           data: result,
           message: "No wallet transactions"
       });
    }catch(e){
       if(e){
           res.status(500).json({
               success: false,
               error: true,
                message: e?.response?.message || 'Something wrong has happened'
           });
       }
    }
};
