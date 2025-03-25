const { validationResult } = require("express-validator");
const { getLatestUserInstagramActivityLog } = require("../user/get.user.instagram.activity.log");
const { deleteUserInstagramActivityLog } = require("../user/instagram/delete.user.instagram.activity.log");
const { saveTikTokUserToken } = require("../user/tiktok/store.mongo.tiktok.token");
const { saveTikTokUserProfile } = require("../user/tiktok/store.mongo.tiktok.profile");
const { getUserEmailByReferenceNumber } = require("../user/get.user.email.by.reference.no");
const { generateAccessToken, getUserTikTokProfile } = require("../../services/TIKTOK");
const { sendMessageToQueue } = require("../../services/RABBIT-MQ");
const { MEMORY_QUEUE_NAME } = require("../../constants/app_constants");

module.exports.GenerateTikTokAccessToken = async(req,res) => {
  const { code,state,error } = req.body;
  const errors = validationResult(req);	
  if(errors.isEmpty()){
      if(error){
	  return res.status(500).send({success: false, error: true, message: 'Access denied. Please try again later.'});
      }	  
      if(!code){
          return res.status(400).send({success: false, error: true, message: 'Authorization code missing. Please link your Instagram account.'});
      }  
      if(!state){
          return res.status(400).send({success: false, error: true, message: 'State value missing.'});
      }	  
      const response = await generateAccessToken(code); 
      console.log(response[1]);
      const service = "tiktok";	  
      const userData = await getLatestUserInstagramActivityLog(service,state);
      if(!userData){
          return res.status(400).send({success: false, error: true, message: 'Something wrong has happened. Please try again.'});
      }	  
      const { reference_number,client_type } = userData;
      const email = await getUserEmailByReferenceNumber(reference_number);	  
      if(response[0]){
	  const { access_token, refresh_token, open_id, scope, expires_in } = response[1];
	  const payload = { reference_number, access_token, refresh_token, open_id, scope, expires_in };    
	  await saveTikTokUserToken(payload);
	  const userInfo = await getUserTikTokProfile(access_token);
	  const tiktokProfile = { 
	       reference_number: reference_number,
	       display_name: userInfo[1].display_name,
	       open_id: userInfo[1].open_id, 
	       profile_deep_link: userInfo[1].profile_deep_link, 
	       union_id: userInfo[1].union_id, 
	       avatar_url: userInfo[1].avatar_url, 
               bio_description: userInfo[1].bio_description 
	  };
	  await saveTikTokUserProfile(tiktokProfile);
	  const email = await getUserEmailByReferenceNumber(reference_number); 	  
	  const payload2 = {
              channel_name: 'activity_log',    
	      email: email,    
              reference_number: reference_number,
              activity_name: 'TikTok login was successful.'      
	  };
	  await sendMessageToQueue(MEMORY_QUEUE_NAME,JSON.stringify(payload2));	  
          res.status(200).json({
	      success: true,
              error: false,
              message: 'TikTok access information has been saved'		  
	  });
          //-.clean up.
	  await deleteUserInstagramActivityLog(reference_number,"authorize");
      }else{
          const payload2 = {
              channel_name: 'error_log',
	      email: email,	  
              reference_number: reference_number,
	      error_status: 400,	  
	      error_message: `ERROR: ${response[1]}` 	  
	  };
	  await sendMessageToQueue(MEMORY_QUEUE_NAME,JSON.stringify(payload2));      
          res.status(400).json({
              success: false,
              error: true,
              message: response[1]
          });
      }   
  }else{
      res.status(422).json({ success: false, error: true, message: errors.array() });
  }
};
