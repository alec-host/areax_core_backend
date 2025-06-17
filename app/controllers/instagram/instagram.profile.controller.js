const { validationResult } = require("express-validator");
const { getLatestUserInstagramActivityLog } = require("../user/get.user.instagram.activity.log");
const { deleteUserInstagramActivityLog } = require("../user/instagram/delete.user.instagram.activity.log");
const { connectToRedis, closeRedisConnection } = require("../../cache/redis");
const { APPLICATION_BASE_URL,MEMORY_QUEUE_NAME,RABBITMQ_QUEUE_LOGS } = require("../../constants/app_constants");
const { saveInstagramUserToken } = require("../user/instagram/store.mongo.instagram.token");
const { saveInstagramUserData } = require("../user/instagram/store.mongo.instagram.data");
const { getUserEmailByReferenceNumber } = require("../user/get.user.email.by.reference.no");
const { getInstagramToken, instagramProfile, getLongLivedAccessToken } = require("../../services/INSTAGRAM");
const { sendMessageToQueue } = require("../../services/RABBIT-MQ");

module.exports.GetInstagramProfile = async(req,res) => {
    const { code, state, error, error_reason, error_description, message } = req.query;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(422).json({ success: false, error: true, message: errors.array() });	    
    }
    if(error && error_reason === 'user_denied'){
       return res.status(403).send({success: false, error: true, message:'Access denied. Please try again later.'});
    }	
    if(error && error_description){
       return res.status(400).send({success: false, error: true, message: error_description});
    }
    if(message){
       return res.status(400).send({success: false, error: true, message: message});
    }
    if(!code){
       return res.status(400).send({success: false, error: true, message: 'Authorization code missing. Please link your Instagram account.'});
    }
    if(!state){
       return res.status(400).send({success: false, error: true, message: 'State value missing.'});
    }
    const tokenResponse = await getInstagramToken(code,"authorize");
    const service = "ig";
    const userData = await getLatestUserInstagramActivityLog(service,state);
    if(!userData){
       return res.status(400).send({success: false, error: true, message: 'Something wrong has happened. Please try later'});
    }	    
    const { reference_number,client_type } = userData;  
    if(!client_type || (client_type !== "web" && client_type !== "mobile")){
       return res.status(400).json({success: false,error: true,message: 'Missing client_type i.e. { web or mobile }.'});
    }	    
    const email = await getUserEmailByReferenceNumber(reference_number);
    if(tokenResponse[0] === true){	
       const profile = await instagramProfile(tokenResponse[1]);
       if(profile[0] === true){
           //-.get long lived token.    
	   const longLivedToken = await getLongLivedAccessToken(tokenResponse[1]);
	   //-.get profile data.    
           const { id,user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count } = profile[1];
           const payload = { reference_number,id,user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count };
	   //-.save profile data.    
           await saveInstagramUserData(payload,reference_number);
	   //-.save long lived token.    
	   if(longLivedToken){    
              await saveInstagramUserToken({ reference_number: reference_number,access_token: tokenResponse[1],long_lived_token: longLivedToken });
	   }
           //-.cache token.
           const client = await connectToRedis();
           if(client){
              if(longLivedToken){
                 await client.set(reference_number,longLivedToken);
              }
              await closeRedisConnection(client);
           }
	   const message = 'Your Instagram profile information has been shared with Project W-IG.';
	   const payload2 = {
	       channel_name: 'activity_log',
	       email: email,	
               reference_number: reference_number,
	       activity_name: 'Instagram login was successful.'			
	   };    
	   await sendMessageToQueue(RABBITMQ_QUEUE_LOGS,JSON.stringify(payload2)); 
           //-.client type.
           await deleteUserInstagramActivityLog(reference_number,"authorize");
           await deleteUserInstagramActivityLog(reference_number,"deauthorize");		
	   if(client_type === "mobile"){
               res.status(200).json({
                   success: true,
                   error: false,
                   message: message
               });
               return;
	   }    
           res.redirect(`${APPLICATION_BASE_URL}/instagram?message=${message}`);
       }
       if(client_type === "mobile"){
	  if(profile[0]){			
             res.status(200).json({
                 success: true,
                 error: false,
                 data: profile[1],
	         message: 'Instagram Profile Details'    
             });	
             return;
	  }
	  const messageMobile = `Error retrieving Instagram profile. ${profile[1]}`;   
	  const payloadMobile = {
	      channel_name :"error_log",	
	      email: email,	
	      reference_number: reference_number,
	      error_code: 400,
	      error_message: messageMobile 
          };    
          await sendMessageToQueue(RABBITMQ_QUEUE_LOGS,JSON.stringify(payloadMobile));    
          res.status(400).json({
              success: false,
              error: true,
              data: profile[1],
              message: messageMobile
          });
          return;   
       }  
       if(profile[0]){ 
          res.redirect(303,`${APPLICATION_BASE_URL}/instagram?message=${profile[1]}`);
       }
       const messageWeb = `Error retrieving Instagram profile. ${profile[1]}`;    
       const payloadWeb = {
             channel_name :"error_log",
             email: email,		
             reference_number: reference_number,
	     error_code: 400,	
             error_message: messageWeb
       };
       await sendMessageToQueue(RABBITMQ_QUEUE_LOGS,JSON.stringify(payloadWeb));    
       res.status(400).json({
           success: false,
           error: true,
           data: profile[1],
           message: messageWeb
       });
       return;
    }
    const messageLast = `ERROR: ${tokenResponse[1]}`;
    const payloadLast = {
       channel_name :"error_log",
       email: email,
       reference_number: reference_number,
       error_code: 400,
       error_message: messageLast
    };
    await sendMessageToQueue(RABBITMQ_QUEUE_LOGS,JSON.stringify(payloadLast));
    res.status(400).json({
        success: false,
        error: true,
        message: messageLast
    });
};
