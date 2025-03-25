const { body, query, check, param, validationResult } = require("express-validator");

/*
export const sampleValidator = [
    body('user.username', 'username does not Empty').not().isEmpty(),
    body('user.email', 'Invalid email').isEmail(),
    body('user.age', 'username must be Alphanumeric').isAlphanumeric(),
    body('user.birthday', 'Invalid birthday').isISO8601(), // check date is ISOString
    body('user.password', 'password does not Empty').not().isEmpty(),
    body('user.password', 'The minimum password length is 6 characters').isLength({min: 6}),
];
*/

const signUpValidator = [
    body('username', 'Missing: name must be checked').not().isEmpty(),
    body('email', 'Missing: email must be checked').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
];

const googleSignInValidator = [
    body('idToken', 'Missing: idToken must be checked').not().isEmpty(),
];

const signInValidator = [
    body('email', 'Email cannot be Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
];

const signOutValidator = [
    body('email', 'Missing: email must be checked').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
];

const healthCheckValidator = [
    body('word','Word cannot be Empty').not().isEmpty(),
];

const confirmEmailValidator = [
    body('email', 'Email cannot be Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(), 
    body('reference_number', 'Reference number must be provided').not().isEmpty(),
    body('otp', 'The minimum OTP length is 6 characters').isLength({min:6}),
];

const confirmPhoneValidator = [
    body('phone', 'Phone cannot be Empty').not().isEmpty(),
    body('reference_number', 'Reference number must be provided').not().isEmpty(),
    body('otp', 'The minimum OTP length is 6 characters').isLength({min:6}),
];

const addPhoneValidator = [
    body('phone', 'Phone must be provided').not().isEmpty(),
    //body('phone', 'Invalid mobile phone').isMobilePhone(),
    body('email', 'Email cannot be Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(), 
    body('reference_number', 'Reference number must be provided').not().isEmpty(),
];
  
const verifyPhoneValidator = [
    body('phone', 'Phone must be provided').not().isEmpty(),
    //body('phone', 'Invalid mobile phone').isMobilePhone(),
    body('email', 'Email cannot be Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(), 
    body('reference_number', 'Reference number must be provided').not().isEmpty(),
];

const updateProfileValidator = [
    body('email', 'Email cannot be Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(), 
    //body('phone', 'Phone must be provided').not().isEmpty(),
    //body('username', 'Name must be provided').not().isEmpty(),
    //body('caption', 'Caption must be provided').not().isEmpty(),	
    //body('country', 'Country must be provided').not().isEmpty(),
    //body('city', 'City number must be provided').not().isEmpty(),
    body('reference_number', 'Reference number must be provided').not().isEmpty(),
];

const getProfileValidator = [
    query('email', 'Email cannot be Empty').not().isEmpty(),
    query('email', 'Invalid email').isEmail(), 
    query('reference_number', 'Reference number must be provided').not().isEmpty(),
];

const requestEmailOtpValidator  = [
    body('email', 'Email cannot be Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(), 
    body('reference_number', 'Reference number must be provided').not().isEmpty(),
];

const requestPhoneOtpValidator  = [
    body('phone', 'Phone cannot be Empty').not().isEmpty(),
    body('reference_number', 'Reference number must be provided').not().isEmpty(),
];

const instagramAuthValidator = [
    body('email', 'Email cannot be Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('reference_number', 'Reference number must be provided').not().isEmpty(),
    body('operation_type', 'Operation type must be provided').not().isEmpty(),
    body('client_type', 'Client type must be provided i.e. web = web or app = mobile').not().isEmpty(),	
];

const tiktokAuthValidator = [
    body('email', 'Email cannot be Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('reference_number', 'Reference number must be provided').not().isEmpty(),
    body('client_type', 'Client type must be provided i.e. web = web or app = mobile').not().isEmpty(),
];

const instagramAuthCallbackValidator = [
    query('code', 'Code must be provided').not().isEmpty(),
];

const huggingFaceChatValidator = [
    body('user_message', 'Message cannot be Empty').not().isEmpty(),
    body('email', 'Email cannot be Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('reference_number', 'Reference number must be provided').not().isEmpty(),
];

const formDataValidator = [
    check('email', 'Email cannot be Empty').not().isEmpty(),
    check('email', 'Invalid email').isEmail(),
    check('reference_number', 'Reference number must be provided').not().isEmpty(),
];

const tokenIdValidator = [
    check('email', 'Email cannot be Empty').not().isEmpty(),
    check('email', 'Invalid email').isEmail(), 
    check('reference_number', 'Reference number must be provided').not().isEmpty(),
    check('token_id', 'Token id must be provided').not().isEmpty(),
];

const blockchainWalletValidator = [
    body('email', 'Email cannot be Empty').not().isEmpty(),
    body('email', 'Invalid email').isEmail(), 
    body('reference_number', 'Reference number must be provided').not().isEmpty(),
    body('wallet_address', 'Wallet address must be provided').not().isEmpty(),
    body('private_key', 'Private key must be provided').not().isEmpty(),
];

const forgetPasswordValidator = [
    body('reference_number', 'Missing: reference_number must be checked').not().isEmpty(),
    body('email', 'Missing: email must be checked').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('otp', 'OTP must be checked').not().isEmpty(),	
    body('password', 'Missing: password must be checked').not().isEmpty(),
    body('password', 'The minimum password length is 6 characters').isLength({min: 6}),
    body('confirm_password', 'Missing: confirm password must be checked').not().isEmpty(),
    body('confirm_password', 'The minimum confirm password length is 6 characters').isLength({min: 6}),
];

const passwordChangeValidator = [
    body('reference_number', 'Missing: reference_number must be checked').not().isEmpty(),
    body('email', 'Missing: email must be checked').not().isEmpty(),
    body('email', 'Invalid email').isEmail(),
    body('old_password', 'Missing: old password must be checked').not().isEmpty(),
    body('old_password', 'The minimum old password length is 6 characters').isLength({min: 6}),
    body('new_password', 'Missing: new password must be checked').not().isEmpty(),
    body('new_password', 'The minimum new password length is 6 characters').isLength({min: 6}),	
    body('confirm_new_password', 'Missing: confirm new password must be checked').not().isEmpty(),
    body('confirm_new_password', 'The minimum confirm new password length is 6 characters').isLength({min: 6}),
];

const s3BucketValidator = [
    body('file_name', 'File Name cannot be Empty').not().isEmpty(),
    body('file_type', 'File Type cannot be Empty').not().isEmpty(),
];

const getIgUserIdValidator = [
    query('reference_number', 'Missing: reference_number must be provided').not().isEmpty(),
];

const getUsersLocationValidator = [
    query('start', 'Missing: start must be provided').not().isEmpty(),
    query('limit', 'Missing: limit must be provided').not().isEmpty(),	
];

const deleteTierValidator = [
    param('reference_number').exists().withMessage('Missing: reference_number must be provided'),
    (res,req,next) => {
        const errors = validationResult(req);
	if(!errors.isEmpty()){
	    return res.status(400).json({ success: false, error: true, message: errors.array() });	
	}
	next();    
    }	
];

const getTierValidator = [
    query('user', 'Missing: user must be provided').not().isEmpty(),
];

const createTierValidator = [
   body('name', 'name cannot be Empty').not().isEmpty(),
   body('monthly_cost', 'monthly_cost cannot be Empty').not().isEmpty(),
   body('yearly_cost', 'yearly_cost cannot be Empty').not().isEmpty(),
   body('campaign_specific_price', 'campaign_specific_price cannot be Empty').not().isEmpty(),
   body('entry', 'entry cannot be Empty').not().isEmpty(),
   body('benefits', 'benefits cannot be Empty').not().isEmpty(),
   body('credits_per_action', 'credits_per_action cannot be Empty').not().isEmpty(),
];

const addSubscriptonPlanValidator = [
   body('email', 'Missing: email must be provided').not().isEmpty(),	
   body('reference_number', 'Missing: reference_number must be provided').not().isEmpty(),
   body('tier_reference_number', 'Missing: tier_reference_number must be provided').not().isEmpty(),
];

const getSubscriptionPlanValidator = [
   body('email', 'Missing: email must be provided').not().isEmpty(),
   body('reference_number', 'Missing: reference_number must be provided').not().isEmpty(),
   body('tier_reference_number', 'Missing: tier_reference_number must be provided').not().isEmpty(),
   body('payment_plan', 'Missing: payment_plan must be provided').not().isEmpty(),
];

module.exports = {
    signUpValidator,
    googleSignInValidator,
    signInValidator,
    signOutValidator,
    healthCheckValidator,
    confirmEmailValidator,
    confirmPhoneValidator,	
    addPhoneValidator,
    verifyPhoneValidator,
    updateProfileValidator,
    getProfileValidator,
    requestEmailOtpValidator,
    requestPhoneOtpValidator,	
    instagramAuthValidator,
    instagramAuthCallbackValidator,
    tiktokAuthValidator,	
    huggingFaceChatValidator,
    formDataValidator,
    tokenIdValidator,
    s3BucketValidator,
    blockchainWalletValidator,
    forgetPasswordValidator,	
    passwordChangeValidator,
    getIgUserIdValidator,
    getUsersLocationValidator,
    deleteTierValidator,
    getTierValidator,
    createTierValidator,
    addSubscriptonPlanValidator,
    getSubscriptionPlanValidator	
};
