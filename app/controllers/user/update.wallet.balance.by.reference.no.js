const { db } = require("../../models");

const Wallets = db.wallets;

module.exports.depositByReferenceNumber = async(reference_number,purchasedCredit) => {
    const wallet = await Wallets.findOne({where:{reference_number:reference_number}}).catch(e => { return [false,'User not found']; });
    if(!wallet){
	console.log('Wallet not found');    
        return [false,'Wallet not found'];
    }
    const cummulate_bal = (parseFloat(wallet.balance) + parseFloat(purchasedCredit));
    console.log('BAL ', cummulate_bal);	
    const isUpdated = await Wallets.update({balance: cummulate_bal},{ where:{reference_number:reference_number}}).catch(e => { return [false,e.message]; });	
    if(!isUpdated){
	console.log('Failed to make a deposit');    
	return [false,'Failed to make a deposit'];
    }	
    return [true,'Wallet balance has been updated.'];
};

module.exports.withdrawByReferenceNumber = async(reference_number,usedCredit) => {
    const wallet = await Wallets.findOne({where:{reference_number:reference_number}}).catch(e => { return [false,'User not found']; });
    if(!wallet){
	console.log('Wallet not found');    
        return [false,'Wallet not found'];
    }
    let cummulate_bal;	
    if(wallet.balance >= usedCredit){
    	cummulate_bal = (parseFloat(wallet.balance) - parseFloat(usedCredit));
    }else{
	console.log('You do not have sufficient credit.');    
	return [false,'You do not have sufficient credit.'];
    }	    
    const isUpdated = await Wallets.update({balance: cummulate_bal},{ where:{reference_number:reference_number}}).catch(e => { return [false,e.message]; });
    if(!isUpdated){
        console.log('Failed to make a withdrawal');
        return [false,'Failed to make a withdrawal'];
    }
    return [true,'Withdrawal was successful'];
};
