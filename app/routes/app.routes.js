const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const auth = require("../middleware/auth");
const basicAuth = require("../middleware/basic.auth");
const uploadFile = require("../middleware/upload.storage");
const rateLimit = require("../middleware/rate.limit");
const { allowLocalTraffic } = require("../middleware/allow.local.traffic");
const sanitizeInput = require('../middleware/sanitizeInput');

const signUpController = require("../controllers/signup/signup.controller");
const googleAuthController = require("../controllers/google-signin/google.auth.controller");
const signInController = require("../controllers/signin/user.signin");
const signOutController = require("../controllers/signout/user.signout");
const signedInStatusController = require("../controllers/signin/user.signed.in.status");
const forgetPasswordController = require("../controllers/password-management/modify.password.controller");
const changePasswordController = require("../controllers/password-management/change.password.controller");
const healthCheckController = require("../health/health.check");
const confirmEmailController = require("../controllers/otp/email/confirm.email.controller");
const confirmWhatsAppPhoneNumberController = require("../controllers/otp/whatsapp/confirm.whatsapp.controller");
const addPhoneController = require("../controllers/otp/phone/add.phone.controller");
const verifyPhoneController = require("../controllers/otp/phone/verify.phone.controller");
const modifyUserProfileController = require("../controllers/profile/update.user.profile");
const updateUserProfilePictureController = require('../controllers/profile/upload.user.profile.picture');
const updateGaurdianPictureController = require('../controllers/profile/upload.user.guardian.picture');
const updateWallpaperPictureController = require('../controllers/profile/upload.user.wallpaper.picture');
const modifyUserTokenIdController = require("../controllers/profile/update.user.token.id");
const getProfileController = require('../controllers/profile/get.user.profile');
const getTokenIdController = require('../controllers/profile/get.user.token.id');
const requestEmailOtpController = require('../controllers/otp/email/request.mail.otp');
const requestWhatsAppOtpController = require('../controllers/otp/whatsapp/request.whatsapp.otp');
const forgotPasswordEmailOtpController = require('../controllers/otp/email/forgot.password.email.otp');
const refreshTokenController = require('../controllers/google-signin/google.refresh.token.controller');
const rotateRefreshTokenController = require('../controllers/google-signin/rotate.refresh.token.controller');
const userAuthenticationController = require('../controllers/google-signin/user.authentication.controller');
const uploadImageController = require('../controllers//image-upload/image.upload');
const uploadFileToBucketController = require('../controllers/s3-bucket/upload.file.bucket');
const createBlockchainWalletController = require('../controllers/blockchain-wallet/create.blockchain.wallet.controller');
const instagramBasicInfoController = require('../controllers/instagram/instagram.basic.info.controller');
const instagramAuthController = require('../controllers/instagram/instagram.authorize.controller');
const instagramAuthCallbackController = require('../controllers/instagram/instagram.profile.controller');
const instagramRevokeCallbackController = require('../controllers/instagram/instagram.revoke.controller');
const instagramMediaCallbackController = require('../controllers/instagram/instagram.media.controller');
const instagramDeauthorizeController = require('../controllers/instagram/instagram.deauthorize.controller');
const instagramDeleteAppController = require('../controllers/instagram/instagram.delete.controller');
const deleteUserController = require("../controllers/purge-user/purge.user.controller");
const huggingFaceController = require('../controllers/chat-hugging-face/hugging-face.controller');
const getInstagramUserIdController = require('../controllers/instagram/instagram.user.id.controller');
const getInstagramProfileStatsController = require('../controllers/instagram/instagram.profile.stats.controller');
const instagramTokenExistController = require('../controllers/instagram/instagram.user.token.exist.controller');
const retrieveInstagramMediaRecordController = require('../controllers/instagram/instagram.get.media.record.controller');
const addInstagramMediaRecordConstroller = require('../controllers/instagram/instagram.save.media.record.controller');
const getWalletDetailsController = require('../controllers/wallet/get.user.wallet.balance.controller');
const getWalletTransactionsController = require('../controllers/accounts/get.wallet.transaction.controller');
const tiktokAuthController = require('../controllers/tiktok/tiktok.authorize.controller');
const tiktokAuthCallbackController = require('../controllers/tiktok/tiktok.access.token.controller');
const getTikTokTokenController = require('../controllers/tiktok/tiktok.get.token.controller');
const getTikTokProfileController = require('../controllers/tiktok/tiktok.profile.controller');
const tiktokRevokeController = require('../controllers/tiktok/tiktok.revoke.controller');
const tiktokTokenExistController = require('../controllers/tiktok/tiktok.user.token.exist.controller');
const retrieveTiktokMediaRecordController = require('../controllers/tiktok/tiktok.get.media.record.controller');
const walletDepositController = require('../controllers/wallet/handle.wallet.deposit.controller');
const walletWithdrawController = require('../controllers/wallet/handle.wallet.withdrawal.controller');
const updateUserLocationController = require('../controllers/profile/update.user.location.controller');
const getUsersLocationController = require('../controllers/profile/get.users.location.controller');
const systemErrorController = require('../controllers/logs/system.error.log');
const userActvityController = require('../controllers/logs/user.activity.log');
const combinedActivityErrorLogsController = require('../controllers/logs/combined.log');
const createSubscriptionTierController = require('../controllers/tiers/subscription.tiers.controller');
const updateSubscriptionTierController = require('../controllers/tiers/update.subscription.tiers.controller');
const getSubscriptionTierController = require('../controllers/tiers/get.subscription.tiers.controller');
const softDeleteSubscriptionTierController = require('../controllers/tiers/soft.delete.subscription.tiers.controller');
const subscriptionPlanController = require('../controllers/tiers/add.selected.subscription.tiers.controller');
const getSubscriptionPlanController = require('../controllers/tiers/get.subscription.tier.details.controller');
const getSubscriptionPlanListController = require('../controllers/tiers/get.subscription.tiers.list.controller');
const readMqMessageController = require('../controllers/mq/read.mq.message.controller');
const changeProfileStatusController = require('../controllers/profile/change.profile.status');
const generatedReferralController = require('../controllers/referral/referral.controller');

const error = require("./error/error.routes");
const { 
	  healthCheckValidator, signInValidator, signOutValidator, googleSignInValidator, addPhoneValidator, 
	  verifyPhoneValidator, confirmEmailValidator, confirmPhoneValidator, updateProfileValidator, getProfileValidator,
	  requestEmailOtpValidator, requestPhoneOtpValidator, signUpValidator, instagramAuthValidator, 
	  instagramAuthCallbackValidator, tokenIdValidator, s3BucketValidator, blockchainWalletValidator, 
	  formDataValidator, forgetPasswordValidator, passwordChangeValidator, getIgUserIdValidator, tiktokAuthValidator,
	  getUsersLocationValidator, deleteTierValidator, getTierValidator, createTierValidator, addSubscriptonPlanValidator, 
	  getSubscriptionPlanValidator, formDataGaurdianValidator, rotateTokenValidator, userAuthenticationValidator, emailValidator, processReferralCodeValidator 
      } = require("../validation/common.validation");

/**
 *  
 * Add auth in the routes below.
 * 
 * Execute JWT method on login & for security sake save token generated in a session rather than on the localStorage.
 * 
 * auth is passed as shown below in a route:
 * 
 * route.post('/myRoute',auth,myRouteController.ExampleMethod);
 * 
 */

// 1. Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project W Core APIs',
      version: '1.0.0',
      description: 'API documentation using external YAML files',
    },
    servers: [
      { url: '/' }
    ],
  },
  apis: ['../docs/*.yaml', './routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

module.exports = async(app) => {

    const router = require("express").Router();

  // Serve Swagger JSON spec
  app.get('/api-time-machine-docs/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  // Serve Swagger UI HTML (using CDN for assets)
  app.get('/api-core-docs', (req, res) => {
     res.send(`
       <!DOCTYPE html>
       <html lang="en">
        <head>
         <meta charset="UTF-8">
         <title>Core API Documentation</title>
         <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui.css" />
         <style>
          body { margin: 0; padding: 0; }
         </style>
        </head>
        <body>
         <div id="swagger-ui"></div>
         <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-bundle.js"></script>
         <script src="https://unpkg.com/swagger-ui-dist@5.10.5/swagger-ui-standalone-preset.js"></script>
         <script>
          window.onload = function() {
          window.ui = SwaggerUIBundle({
             url: '/api-core-docs/swagger.json',
             dom_id: '#swagger-ui',
             deepLinking: true,
             presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
             ],
             plugins: [
               SwaggerUIBundle.plugins.DownloadUrl
             ],
             layout: "StandaloneLayout"
          });
          };
         </script>
        </body>
       </html>
      `);
     });

    /**
     * Paths: /api/v1/signUp:
     * Method: POST
     * @@username
     * @@email
     * @@password
     * @@referral_code (optional)
     * @@device_fingerprint (optional)
     * Description: Manual sign up.            
    */
    router.post('/signUp',signUpValidator,sanitizeInput,signUpController.UserSignUp);
    /**
     * Paths: /api/v1/signUp:
     * Method: POST
     * @@idToken
     * @@referral_code (optional)
     * @@device_fingerprint (optional) 
     * Description: Google sign up.            
    */
    router.post('/googleSignUp',googleSignInValidator,sanitizeInput,googleAuthController.GoogleUserSignIn);	
     /**
     * paths: /api/v1/googleSignIn:
     * Method: POST
     * @@idToken
     * Description: Sign in via Google.            
    */
    router.post('/googleSignIn',googleSignInValidator,sanitizeInput,googleAuthController.GoogleUserSignIn);
    /**
     * Paths: /api/v1/signIn:
     * Method: POST
     * @@email
     * @@password
     * Description: Manual sign in.            
    */
    router.post('/signIn',/*rateLimit(5, 5*60*1000),*/signInValidator,sanitizeInput,signInController.SignIn);
    /**
     * Paths: /api/v1/signOut:
     * Method: POST
     * @@email
     * Bearer Token: required
     * Description: Sign out operation.            
    */
    router.post('/signOut',signOutValidator,sanitizeInput,signOutController.SignOut);
    /**
     * Paths: /api/v1/signedInStatus
     * Method: POST
     * @@email
     * @@reference_number
     * Bearer Token: required
     * Description: Shows whether one is signed in or not ie.(1) signed in,  (0) not signed in.            
    */
    router.post('/signedInStatus',auth,requestEmailOtpValidator,sanitizeInput,signedInStatusController.SignedInStatus);
    /**
     * Paths: /api/v1/changePassword
     * Method: POST
     * @@email
     * @@reference_number
     * @@password
     * @@confirm password
     * Bearer Token: required
     * Description: Change password.
    */
    router.post('/changePassword',/*auth,passwordChangeValidator,*/sanitizeInput,changePasswordController.ChangePassword);
    /**
     * Paths: /api/v1/forgotPassword
     * Methodd: POST
     * @@email
     * @@reference_number
     * @@password
     * @@confirm password
     * Bearer Token: required
     * Description: Change password.
    */
    router.post('/forgotPassword',auth,forgetPasswordValidator,sanitizeInput,forgetPasswordController.ModifyPassword);	
    /**
     * Paths: /api/v1/ping
     * Method: POST
     * @@email
     * @@reference_number
     * Bearer Token: required
     * Description: health app check.            
    */	
    router.post('/ping',auth,healthCheckValidator,sanitizeInput,healthCheckController.HealthCheck);
    /**
     * Paths: /api/v1/confirmEmail
     * Method: POST
     * @@email
     * @@reference_number
     * @@otp
     * Bearer Token: required
     * Description: Email address confirmed via received OTP mail.            
    */
    router.post('/confirmEmail',auth,confirmEmailValidator,sanitizeInput,confirmEmailController.ConfirmEmail);
    /**
     * Path /api/v1/confirmWhatsAppPhoneNumber
     * Method: POST
     * @@phone
     * @@reference_number
     * @@otp
     * Bearer Token: required
     * Description: Phone number confirmed via received whatsapp OTP.
    */
    router.post('/confirmWhatsAppPhoneNumber',confirmPhoneValidator,sanitizeInput,confirmWhatsAppPhoneNumberController.ConfirmWhatsAppPhoneNumber);
    /**
     * Path: /api/v1/addPhoneNumber
     * Method: POST
     * @@phone
     * @@reference_number
     * @@otp
     * Bearer Token: required
     * Description: Add a phone number.
    */
    router.post('/addPhoneNumber',auth,addPhoneValidator,sanitizeInput,addPhoneController.AddPhone);
    /**
     * Path: /api/v1/verifyPhone:
     * Method: POST
     * @@phone
     * @@email
     * @@reference_number
     * Bearer Token: required
     * Description: Phone has been verified.            
    */
    router.post('/verifyPhoneNumber',auth,verifyPhoneValidator,sanitizeInput,verifyPhoneController.VerifyPhone);
    /**
     * Path: /api/v1/updateUserProfile:
     * Method: PATCH
     * @@email
     * @@phone
     * @@country_code
     * @@country
     * @@city
     * @@reference_nunber
     * Bearer Token: required
     * Description: User profile has been updated.            
    */
    router.patch('/updateUserProfile',auth,updateProfileValidator,sanitizeInput,modifyUserProfileController.UpdateProfile);
    /**
     * Path: /api/v1/updateUserProfilePicture:
     * Method; POST
     * @@email
     * @@reference_number
     * Bearer Token: required
     * Description: Upload User profile picture.
    */
    router.post('/uploadUserProfilePicture',uploadFile.single('image'),auth,formDataValidator,sanitizeInput,updateUserProfilePictureController.UploadProfilePicture);
    /**
     * Path: /api/v1/uploadSpiritAnimalPicture:
     * Method; POST
     * @@email
     * @@reference_number
     * @@gaurdian_name
     * Bearer Token: required
     * Description: Upload Spirit animal picture.
    */
    router.post('/uploadGuardian',uploadFile.single('image'),auth,formDataGaurdianValidator,sanitizeInput,updateGaurdianPictureController.UploadGaurdianPicture);	
    /**
     * Path: /api/v1/uploadWallpaper:
     * Method; POST
     * @@email
     * @@reference_number
     * @@gaurdian_name
     * Bearer Token: required
     * Description: Upload Wallpaper picture.
    */	
    router.post('/uploadWallpaper',uploadFile.single('image'),auth,formDataValidator,sanitizeInput,updateWallpaperPictureController.UploadWallpaperPicture);
    /**
     * Path: /api/v1/addBlockchainTokenId:
     * Method: POST
     * @@email
     * @@reference_number
     * @@token_id
     * Bearer Token: required
     * Description: Update token id against a user.
    */
    router.post('/addBlockchainTokenId',auth,tokenIdValidator,sanitizeInput,modifyUserTokenIdController.UpdateTokenId);	
    /**
     * Path: /api/v1/getUserProfile
     * Method: GET
     * @@email
     * @@reference_number
     * Bearer Token: required
     * Description: Retrieve user profile information.            
    */
    router.get('/getUserProfile',auth,getProfileValidator,sanitizeInput,getProfileController.GetProfile);
     /**
     * paths: /api/v1/getBlockchainTokenId:
     * Method: GET
     * @@email
     * @@reference_number
     * Bearer Token: required
     * Description: Get blockchain ID.           
    */   
    router.get('/getBlockchainTokenId',auth,getProfileValidator,sanitizeInput,getTokenIdController.GetUserTokenID);
    /**
     * paths: /api/v1/requestEmailOtp:
     * Method: POST
     * @@email
     * @@reference_number
     * @@otp
     * Bearer Token: required
     * Description: Initiate an OTP to the provided email.            
    */	
    router.post('/requestEmailOtp',auth,requestEmailOtpValidator,sanitizeInput,requestEmailOtpController.RequestEmailOtp);
    /**
     * paths: /api/v1/requestWhatsAppOtp
     * Method: POST
     * @@phone
     * @@reference_number
     * @@otp
     * Description: OTP has been sent to the provided phone.
    */	
    router.post('/requestWhatsAppOtp',requestPhoneOtpValidator,sanitizeInput,requestWhatsAppOtpController.RequestWhatsAppOtp);	
    /**
     * paths: /api/v1/forgotPasswordEmailOtp:
     * Method: POST
     * @@email
     * Description: OTP has been sent to the provided email.
    */
    router.post('/forgotPasswordEmailOtp',signOutValidator,sanitizeInput,forgotPasswordEmailOtpController.ForgetPasswordEmailOtp);	
    /**
     * paths: /api/v1/getInstagramBasicUserInfo:
     * Method: POST
     * @@email
     * @@reference_number
     * Bearer Token: required
     * Description: Gets users basic information which includes username, account_type, & media_count.            
    */
    router.get('/getInstagramBasicInfo',auth,getProfileValidator,sanitizeInput,instagramBasicInfoController.GetInstagramBasicInfo);
    /**
     * paths: /api/v1/uploadImage:
     * Method: POST
     * @@email
     * @@reference_number
     * @@image
     * Description: Uploads an image and return the Image URL.            
    */	
    router.post('/uploadImage',uploadFile.array('images',2),uploadImageController.UploadImage);
    /**
     * @swagger
     * paths: /api/v1/uploadToBucket
     * @@filename
     * @@filetype
     * Description: Uploads a file to Amazon s3 Bucket & return a URL.            
    */
    router.post('/uploadToBucket',uploadFile.single('file'),s3BucketValidator,sanitizeInput,uploadFileToBucketController.UploadFileToBucket);
    /**
     * paths: /api/v1/createBlockchainWallet:
     * Method: POST
     * @@email
     * @@reference_number
     * @@wallet_address
     * @@private_key
     * Bearer Token: required
     * Description: creates a new blockchain wallet account.            
    */
    router.post('/createBlockchainWallet',auth,blockchainWalletValidator,createBlockchainWalletController.CreateBlockChainWallet);	
    /**
     * Path: /api/v1/refreshToken:
     * Method: POST
     * @@email
     * @@reference_number
     * Description: Generate a new access token and refresh token.
    */ 
    router.post('/refreshAccessToken',requestEmailOtpValidator,sanitizeInput,refreshTokenController.SignInRefreshToken);
    /**
     * Path: /api/v1/rotateRefreshToken:
     * Method: POST
     * @@email
     * @@reference_number
     * @@old_refresh_token
     * Description: Generate a new access token and refresh token.
    */
    router.post('/rotateRefreshToken',rotateTokenValidator,sanitizeInput,rotateRefreshTokenController.RotateRefreshToken);	
    /**
     * Path: /api/v1/testUserAuthentication:
     * Method: POST
     * @@email
     * @@password
     * Description: Generate a new access token and refresh token.
    */
    router.post('/testUserAuthentication',userAuthenticationValidator,sanitizeInput,userAuthenticationController.UserAuthentication);	
     /**
     * Path: /api/v1/auth/deleteUserAccount:
     * Method: POST
     * @@email
     * @@reference_number
     * Description: Delete user account.
    */   
    router.post('/deleteUserAccount',requestEmailOtpValidator,sanitizeInput,deleteUserController.PurgeUser);	
    /**
     * Path: /api/v1/auth/instagram:
     * Method: POST
     * @@email
     * @@reference_number
     * @@client_type
     * Description: Authorize user via oauth to have access to Instagram resources.            
    */
    router.post('/auth/instagram',instagramAuthValidator,sanitizeInput,instagramAuthController.InstagramAuthorize);
    /**
     * Path: /auth/instagram/callback:
     * Method: GET
     * @@code
     * @@error_description
     * @@status
     * Description: Access granted and user Instagram profile information.            
    */
    router.get('/auth/instagram/callback',instagramAuthCallbackController.GetInstagramProfile);
    /**
     * Path: /api/v1/revoke/instagram:
     * Method: GET
     * @@email
     * @@reference_number
     * Bearer Token: required
     * Description: Revoke access to Instagram via App.            
     */
    router.post('/revoke/instagram',auth,requestEmailOtpValidator,sanitizeInput,instagramRevokeCallbackController.InstagramRevoke);
    /**
     * Path: /api/v1/media/instagram:
     * Method: GET
     * @@code
     * Description: Get Instagram media(NOT USED).            
    */
    router.get('/media/instagram/callback',instagramAuthCallbackValidator,instagramMediaCallbackController.GetInstagramMedia);
    /**
     * Path: /api/v1/deauthorize/instagram:
     * Method: POST
     * @@email
     * @@reference_number
     * Description: Deauthorize the Instagram app.            
    */
    router.post('/deauthorize/instagram',instagramDeauthorizeController.DeauthorizeInstagramApp);
    /**
     * /api/v1/delete/instagram:
     * Method: POST
     * @@email
     * @@reference_number
     * Description: Delete the Instagram app (actual method does not exist. IG data is purged from the platform).            
    */
    router.post('/delete/instagram',instagramDeleteAppController.DeauthorizeInstagramApp);
    /**
     * /api/v1/getInstagramUserId:
     * Method: GET
     * @@email
     * @@reference_number
     * Description:Get instagram user unique ID..
    */
    router.get('/instagramUserId',getIgUserIdValidator,sanitizeInput,getInstagramUserIdController.GetInstagramUserId);
    /**
     * /api/v1/getInstagramProfileStats:
     * Method: GET
     * @@email
     * @@reference_number
     * Description: Get instagram user profile stats.
    */
    router.get('/instagramProfileStats',auth,getIgUserIdValidator,getInstagramProfileStatsController.GetInstagramProfileStats);	
    /**
     * /api/v1/instagramTokenExist:
     * Method: POST:
     * @@email
     * @@reference_number
     * Description: return instagram token status i.e. status 0 or 1.
    */
    router.post('/instagramTokenExist',auth,requestEmailOtpValidator,sanitizeInput,instagramTokenExistController.InstagramTokenExist);	
    /**
     * /api/v1/getInstagramMediaRecord:
     * Method: GET
     * @@email
     * @@reference_number:
     * Description: return instagram media record.
    */
    router.get('/instagramMediaRecord',auth,retrieveInstagramMediaRecordController.RetrieveInstagramMediaRecords);
    /**
     * /api/v1/getWalletDetails
     * Method: GET
     * @@email
     * @@reference_number
    */
    router.get('/getWalletDetails',auth,getProfileValidator,sanitizeInput,getWalletDetailsController.GetWalletDetails);	
    /**
     * /api/v1/getWalletTransactions
     * Method: GET
     * @@email
     * @@reference_number
     * @@page
     * @@limit
    */
    router.get('/getWalletTransactions',auth,getWalletTransactionsController.GetWalletTransactions);
    /**
     * Method: POST
     * @@/api/v1/auth/tiktok:
     * @@description: Access token granted.
    */
    router.post('/auth/tiktok',auth,tiktokAuthValidator,tiktokAuthController.TiktokAuthorize);
    /**
     * Method: POST
     * @@/api/v1/auth/tiktok/callback:
     * @@description: Access token granted.
    */
    router.post('/auth/tiktok/callback',tiktokAuthCallbackController.GenerateTikTokAccessToken);	
    /**
     * /api/v1/tiktokUserProfile
     * Method: GET
     * @@email
     * @@reference_number
    */
    router.get('/tiktokUserProfile',auth,getProfileValidator,sanitizeInput,getTikTokProfileController.GetTiktokProfile);
    /**
     * /api/v1/tiktokToken
     * Method: GET
     * @@reference_number
    */	
    router.get('/tiktokToken',getTikTokTokenController.GetTikTokToken);
    /**
     * Path: /api/v1/revoke/tiktok:
     * Method: POST
     * @@email
     * @@reference_number
     * Bearer Token: required
     * Description: Revoke access to Tiktok via App.
     */
    router.post('/revoke/tiktok',auth,requestEmailOtpValidator,sanitizeInput,tiktokRevokeController.TiktokRevoke);
    /**
     * /api/v1/tiktokMediaRecord:
     * Method: GET
     * @@email
     * @@reference_number:
     * Description: return tiktok media record.
    */
    router.get('/tiktokMediaRecord',auth,retrieveTiktokMediaRecordController.RetrieveTiktokMediaRecords);	
    /**
     * /api/v1/tiktokTokenExist:
     * Method: POST:
     * @@email
     * @@reference_number
     * Description: return tiktok token status i.e. status 0 or 1.
    */
    router.post('/tiktokTokenExist',auth,requestEmailOtpValidator,sanitizeInput,tiktokTokenExistController.TiktokTokenExist);	
    /**
     * Method: POST
     * @@/api/v1/depositPoints:
     * @@email
     * @@reference_number
     * @@amount
     * @@description: Update points after deposit.
    */
    router.post('/depositPoints',walletDepositController.HandleWalletDeposit);
    /**
     * Method: POST
     * @@/api/v1/withdrawPoints:
     * @@description: Update points after withdrawal.
    */
    router.post('/withdrawPoints',walletWithdrawController.HandleWalletWithdraw);
    /**
     * Method: POST
     * @@/api/v1/updateUserLocation:
     * @@description: Update user's location.
    */
    router.post('/updateUserLocation',auth,updateUserLocationController.UpdateUserLocation);
    /**
     * Method: GET
     * @@/api/v1/updateUserLocation:
     * @@description: Update user's location.
    */
    router.get('/getUsersLocation',getUsersLocationValidator,sanitizeInput,getUsersLocationController.GetUsersLocation);
    /**
     * Method: POST
     * @@/api/v1/logSystemError:
     * @@email
     * @@reference_number
     * @@description: Log system errors.
    */
    router.post('/logSystemError',auth,systemErrorController.SystemErrorLogs);
    /**
     * Method: POST
     * @@/api/v1/logUserActivity:
     * @@email
     * @@reference_number 
     * @@description: Log user activities.
    */
    router.post('/logUserActivity',auth,userActvityController.UserActivityLogs);
    /**
     * Method: GET
     * @@/api/v1/userLogs:
     * @@email
     * @@reference_number
     * @@search
     * @@description: Log user logs.
    */
    router.get('/userLogs',basicAuth,combinedActivityErrorLogsController.CombinedActivityErrorLogs);
    /**
     * Method: POST
     * @@/api/v1/createSubscriptionTier:
     * @@reference_number
     * @@name
     * @@description: Create new subscription tier.
    */
    router.post('/createSubscriptionTier',basicAuth,createTierValidator,sanitizeInput,createSubscriptionTierController.CreateSubscriptionTiers);
    /**
     * Method: PATCH
     * @@/api/v1/updateSubscriptionTier:
     * @@reference_number
     * @@description: Modify subscription tier's details.
    */
    router.patch('/updateSubscriptionTier',basicAuth,createTierValidator,sanitizeInput,updateSubscriptionTierController.UpdateSubscriptionTiers);
    /**
     * Method: GET
     * @@/api/v1/getSubscriptionTier:
     * @@user
     * @@description: Get a list of subscription tiers.
    */
    router.get('/getSubscriptionTier',basicAuth,getTierValidator,sanitizeInput,getSubscriptionTierController.GetSubscriptionTiers);
    /**
     * Method: DELETE
     * @@/api/v1/deleteSubscriptionTier:
     * @@reference_number
     * @@description: Soft delete a subscription tier.
    */
    router.delete('/deleteSubscriptionTier/:reference_number',basicAuth,deleteTierValidator,sanitizeInput,softDeleteSubscriptionTierController.SoftDeleteSubscriptionTiers);
    /**
     * Method: PATCH
     * @@/api/v1/addSubscriptionPlan:
     * @@reference_number
     * @@tier_reference_number
     * @@description: Add/Modify subscription plan.
    */
    router.patch('/addSubscriptionPlan',auth,addSubscriptonPlanValidator,subscriptionPlanController.AddSubscriptionPlan);	
    /**
     * Method: GET
     * @@/api/v1/getSubscriptionPlanList:
     * @@email
     * @@reference_number
     * @@description: Get a list of subscription tiers.
    */	
    router.get('/getSubscriptionPlanList',auth,getProfileValidator,sanitizeInput,getSubscriptionPlanListController.GetSubscriptionPlanList);	
    /**
     * Method: POST
     * Path: /api/v1/getSubscriptionPlan
     * @@reference_number
     * @@name
     * @@tier_reference_number
     * @@payment_plan - [y/m]
     * @@description: Returns subscription plan details such as cost, credit etc for each user.
    */
    router.post('/getSubscriptionPlan',auth,getSubscriptionPlanValidator,sanitizeInput,getSubscriptionPlanController.GetSubscriptionPlan);
    /**
     * Method: GET
     * @@/api/v1/getMqMessage:
     * @@email
     * @@reference_number
     * @@description: Read a message from RabbitMQ.
    */
    router.get('/getMqMessage',auth,getProfileValidator,sanitizeInput,readMqMessageController.ReadMQMessage);
    /**
     * Method: POST
     * @@/api/v1/privacyStatus:
     * @@basic auth.changeProfileStatusIn
     * @@description: Change user profile status.
    */
    router.post('/privacyStatus',/*allowLocalTraffic('127.0.0.1','9124')*/basicAuth,changeProfileStatusController.ChangeProfileStatus);	
    /**
     * Paths: /api/v1/getReferralCode
     * Method: GET
     * @@email
     * @@reference_number
     * Bearer Token: required
     * Description: get generates referral code.
    */
    router.get('/getReferralCode',auth,getProfileValidator,sanitizeInput,generatedReferralController.GenerateReferralCode);
    /**
     * Paths: /api/v1/processReferralCode
     * Method: GET
     * @@email
     * @@reference_number
     * @@referral_code
     * @@device_fingerprint
     * Bearer Token: required
     * Description: get generates referral code.
    */
    router.post('/processReferralCode',/*auth,*/processReferralCodeValidator,sanitizeInput,generatedReferralController.ProcessReferralCode);	
    /**
     * Paths: /api/v1/gmailExist
     * Method: GET
     * @@email
     * Bearer Token: required
     * Description: get generates referral code.
    */
    router.post('/gmailExist',/*auth,*/emailValidator,sanitizeInput,generatedReferralController.ShowReferralCodeOnGoogleSignUp);

    app.use("/api/v1",router);
    app.use(error.errorHandler);
    //app.use((req, res, next) => { res.status(404).json({ success: false, error: true, error: true, message: 'Endpoint not found or parameter missing' }); });	
};
