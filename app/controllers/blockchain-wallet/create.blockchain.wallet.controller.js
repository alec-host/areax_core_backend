const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { createBlockchainWallet } = require("./create.blockchain.wallet");
const { findBlockchainWalletByReferenceNumber } = require("./find.blockchain.wallet.count.by.reference_number");

module.exports.CreateBlockChainWallet = async(req, res) => {
    const { reference_number, email, wallet_address, private_key } = req.body;	
    const errors = validationResult(req);
    if(errors.isEmpty()){
      try{
        const email_found = await findUserCountByEmail(email);
        if(email_found > 0){
          const reference_number_found = await findUserCountByReferenceNumber(reference_number);		
          if(reference_number_found > 0){
            const payload = { reference_number, email, wallet_address, private_key };
            const response = await createBlockchainWallet(payload);
            if(response[0]){
              const blockchain_wallet_found = await findBlockchainWalletByReferenceNumber(reference_number);		    
              if(blockchain_wallet_found > 0){
                res.status(400).json({
                  success: false, 
                  error: true, 
                  message: `Wallet account with reference_number: ${reference_number} exists.`
                }); 
              }else{	      	    
              	res.status(200).json({
                  success: true, 
                  error: false, 
                  message: response[1]
              	});
	      }
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
      }catch(error){
        console.error('Upload error:', error);
        res.status(500).json({ success: false, error: true,message: 'Something wrong has happened.' });
      }
    }else{
      res.status(422).json({errors: errors.array()});
    }
};
