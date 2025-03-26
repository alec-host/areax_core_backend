const axios = require("axios");
const querystring = require("querystring");
const { TIKTOK_CLIENT_KEY, TIKTOK_REDIRECT_URI, TIKTOK_CLIENT_SECRET } = require("../constants/app_constants");
/**
 * method generates redirect url.
**/
module.exports.tiktokApiLogin = async(uniqueHashString) => {	
    try{
        let authUrl = 'https://www.tiktok.com/v2/auth/authorize/';

        authUrl += `?client_key=${TIKTOK_CLIENT_KEY}`;
        authUrl += `&scope=user.info.basic,user.info.profile,user.info.stats,video.publish,video.upload`;	    
        authUrl += `&response_type=code`;
        authUrl += `&redirect_uri=${TIKTOK_REDIRECT_URI}`;
        authUrl += `&state=${uniqueHashString}`;

        return [true,authUrl];
    }catch(error){
        console.error(error);
        return [false,error];
    }
};

module.exports.generateAccessToken = async(code) => { 
    try{
        const tokenResponse = await axios.post(
           'https://open.tiktokapis.com/v2/oauth/token/',
               querystring.stringify({
               client_key: TIKTOK_CLIENT_KEY,
               client_secret: TIKTOK_CLIENT_SECRET,
               code,
               grant_type: 'authorization_code',
               redirect_uri: TIKTOK_REDIRECT_URI,
	    }),
	    {
               header: {'Content-Type': 'application/x-www-form-urlencoded',},   
	    },  		
	);
    
	if(tokenResponse?.data){    
	   const { access_token, refresh_token, open_id, scope, expires_in } = tokenResponse.data;    
	   return [true,{ access_token, refresh_token, open_id, scope, expires_in }];  
	}else{
           return [false,'Error'];
	}
    }catch(error){
	console.error(error);  
	return [false,error.message];
    }	
};

module.exports.getUserTikTokProfile = async(accessToken) => {
    try{
        const userInfoUrl = 'https://open.tiktokapis.com/v2/user/info/';
        const response = await axios.get(userInfoUrl, {
            headers: {
               Authorization: `Bearer ${accessToken}`,
            },
            params: {
               fields: 'open_id,union_id,avatar_url,display_name,profile_deep_link,bio_description',
            },
        });
        if(response.data.error.code === 'ok') {
            return [true,response.data.data.user];
        } else {
            return [false,`${response.data.error.message}`];
        }	     
    }catch(error){
        console.error(error);
	return [false,error.message];    
    }
};

module.exports.refreshAccessToken = async(refreshToken) => {
   try{
      const tokenUrl = 'https://open.tiktokapis.com/v2/oauth/token/';
      const requestBody = querystring.stringify({
         client_key: TIKTOK_CLIENT_KEY,
         client_secret: TIKTOK_CLIENT_SECRET,
         grant_type: 'refresh_token',
         refresh_token: refreshToken,
      });
      const response = await axios.post(tokenUrl, requestBody, {
         headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
         },
      });   
      const { access_token, refresh_token, expires_in, refresh_expires_in, open_id, scope } = response.data;
      return [true,{ access_token,refresh_token,expires_in,refresh_expires_in,open_id,scope }];      	   
   }catch(error){
      return [false,error.message];
   }
};
