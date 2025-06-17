const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getUserWalletByReferenceNumber } = require("../user/get.user.wallet.balance.by.reference_number");
module.exports.GetWalletDetails = async(req,res) => {
    const errors = validationResult(req);
    const email = req.query.email;
    const reference_number = req.query.reference_number;
    if(!errors.isEmpty()){
	res.status(422).json({success: false, error: true, message: errors.array()});
	return;    
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
       await getUserWalletByReferenceNumber(reference_number,callBack => {
	  if(callBack.length > 0){    
              res.status(200).json({
                  success: true,
                  error: false,
                  data: callBack,
                  message: "Wallet details"
              });
	  }else{
              res.status(404).json({
                  success: true,
                  error: false,
                  data: callBack,
                  message: "No wallet details"
              });
	  }
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
