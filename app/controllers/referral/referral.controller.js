const { validationResult } = require('express-validator');
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getUserRefererCodeByReferenceNumber } = require("../user/get.user.referer.code.by.reference.no");
const { getUserRefererByReferralCode } = require("../user/get.user.referer.by.referral.code");
const { processUserReferral } = require("../user/process.referral.code");
const { modifyUserByEmail } = require("../user/modify.user.by.email");
const { generateReferralCode } = require("../../utils/generate.referral.code");
const { isValidGmail } = require("../../utils/is.valid.gmail");

module.exports.GenerateReferralCode = async(req,res) => {
    const { email, reference_number } = req.query;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({ success: false, error: true, message: errors.array() });
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

        const referralCode = await getUserRefererCodeByReferenceNumber(reference_number);    
         
	if(referralCode) return res.json({ success: true, error: false, referral_code: referralCode, message: 'You already generated a Referral code.' });    

	let unique = false;
	let code = '';   
	while(!unique){    
           code = generateReferralCode();		
	   const exist = await getUserRefererByReferralCode(code);
	   if(!exist) unique = true;	
	}  
        
        await modifyUserByEmail(email, { referral_code: code  });        	
    	    
	res.json({ success: true, error: false, referral_code: code, message: 'Referral code has been generated.' });    
    }catch(e){
        if(e){
            res.status(500).json({
                success: false,
                error: true,
                message: e?.response?.message || e?.response?.data || e?.message || 'Something wrong has happened'
            });
        }
    }
};

module.exports.ProcessReferralCode = async(req,res) => {
    const { email, reference_number, referral_code, device_fingerprint } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({ success: false, error: true, message: errors.array() });
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
        //console.log('XXXXXXXXXXXXXXXXXXX ',email);
	const payload = { email, reference_number, referral_code, device_fingerprint  };  

        const [ok,response] = await processUserReferral(payload);

        if(!ok){
           return res.status(400).json({ success: false, error: true, message: response });
	}       

        res.status(200).json({ success: true, error: false, message: response });
    }catch(e){
        if(e){
            res.status(500).json({
                success: false,
                error: true,
                message: e?.response?.message || e?.response?.data || e?.message || 'Something wrong has happened'
            });
        }
    }
};

module.exports.ShowReferralCodeOnGoogleSignUp = async(req,res) => {
    const { email } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(422).json({ success: false, error: true, message: errors.array() });
        return;
    }
    try{
	const isEmailValid = isValidGmail(email);  
	if(!isEmailValid){
           res.status(400).json({
               success: false,
               error: true,
               message: "Not a valid gmail."
           });
	   return;	
	}    

        const email_found = await findUserCountByEmail(email);
	console.log('CCCCCCCCCCCCCCCCCCCCCC ', email_found);    

        res.status(200).json({
            success: true,
            error: false,
            email_exist: email_found === 1,
            message: email_found === 1 ? "Email already exists." : "Email does not exist."
        });
    }catch(e){
        if(e){
            res.status(500).json({
                success: false,
                error: true,
                message: e?.response?.message || e?.response?.data || e?.message || 'Something wrong has happened'
            });
        }
    }
};
