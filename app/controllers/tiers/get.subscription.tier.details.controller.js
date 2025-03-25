const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getSubscriptionTierByReferenceNumber } = require("../tiers/admin.create.tiers");
const { PAYMENT_PLAN } = require("../../constants/app_constants");

module.exports.GetSubscriptionPlan = async(req,res) => {
    const { email, reference_number, tier_reference_number, payment_plan } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const email_found = await findUserCountByEmail(email);
	    if(email_found > 0){
		 const reference_number_found = await findUserCountByReferenceNumber(reference_number);   
	         if(reference_number_found > 0){	
	            const selectedPaymentPlan = PAYMENT_PLAN.replace(/'/g, '"');		 
		    const acceptedPaymentPlan = JSON.parse(selectedPaymentPlan).some(element => element === payment_plan); 
		    if(acceptedPaymentPlan){	 
                        await getSubscriptionTierByReferenceNumber(tier_reference_number,callBack => {
                             if(callBack && callBack.length > 0){
			         const { reference_number, name, monthly_cost, yearly_cost, entry, credits_per_action  } = callBack[0];
			         let cost = 0.00; 
			         let numberOfMonth = 1;	
			         if(payment_plan === 'y'){
                                     cost = yearly_cost;
				     numberOfMonth = 12;    
			         }else{
	                             cost = monthly_cost;	             		
			         }  
			         const regex = /\{(\d+)\}/;	
			         const creditValue = entry.match(regex);
				 console.log('CREDIT:::: ',creditValue);    
			         if(creditValue){	
                                     const purchased_credit = (creditValue[1]*numberOfMonth);
                                     res.status(200).json({
                                         success: true,
                                         error: false,
                                         data: { tier_reference_number: reference_number, name, cost, purchased_credit, credits_per_action },
                                         message: "Subscription Plan with above details has been selected."
                                     });
			         }else{
                                     res.status(400).json({
                                         success: false,
                                         error: true,
                                         message: "Missing or Invalid entry. Please contact the Admin for assistance."
                                     });
			         }
			     }else{
                                 res.status(404).json({
                                     success: false,
                                     error: true,
                                     message: "The subscription plan does not exist. Please contact the Admin for assistance."
                                 });
			     }
                        });
		    }else{
                        res.status(400).json({
                            success: false,
                            error: true,
                            message: "Payment plan can be Monthly or Yearly."
                        });
		    }
		}else{
                    res.status(404).json({
                        success: false,
                        error: true,
                        message: "Reference Number not found"
                    });
		}    
	    }else{
                res.status(404).json({
                    success: false,
                    error: true,
                    message: "Email not found"
                });
	    }	
	}catch(error){
            if(error){
                res.status(500).json({
                    success: false,
                    error: true,
                    message: error?.message || 'An error has occurred'
                });
            }
        }
    }else{
        res.status(422).json({ success: false, error: true, message: errors.array() });
   }
};
