const axios = require("axios");
const querystring = require("querystring");
const { INSTAGRAM_CLIENT_ID, INSTAGRAM_REDIRECT_URI, INSTAGRAM_CLIENT_SECRET, INSTAGRAM_REVOKE_REDIRECT_URI, INSTAGRAM_MEDIA_REDIRECT_URI } = require("../constants/app_constants");

/**
 * method generates an oauth code.
**/
module.exports.igApiWithIgLogin = async(operation_type,state) => {
    try{
        const endpoint = `https://www.instagram.com/oauth/authorize?enable_fb_login=0&force_authentication=1&client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${operation_type === "authorize" ? INSTAGRAM_REDIRECT_URI : operation_type === "deauthorize" ? INSTAGRAM_REVOKE_REDIRECT_URI : INSTAGRAM_MEDIA_REDIRECT_URI}&response_type=code&scope=business_basic,business_manage_messages,business_manage_comments,business_content_publish&state=${state}`;
        return [true,endpoint];
    }catch(error){
	if(error.response){    
           console.error('BABS            --------> ',error?.response?.data);
           return [false,error?.response?.data?.error_message || error?.response?.message || 'Your Instagram account must be either a Creator or Professional account'] ;
	}else{
           return [false,error.message || 'Your Instagram account must be either a Creator or Professional account'];
	}
    }
};
/**
 * method generates access token (shortLivedToken) expires within an 1hr.
**/
module.exports.getInstagramToken = async(code,operation_type) => {
    const url = 'https://api.instagram.com/oauth/access_token';
    try{
        const tokenResponse = await axios.post(url,querystring.stringify({
            client_id: INSTAGRAM_CLIENT_ID,
            client_secret: INSTAGRAM_CLIENT_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: operation_type === "authorize" ? INSTAGRAM_REDIRECT_URI : operation_type === "deauthorize" ? INSTAGRAM_REVOKE_REDIRECT_URI : INSTAGRAM_MEDIA_REDIRECT_URI,
            code,
        }));
        const accessToken = tokenResponse.data.access_token;
        return [true,accessToken];
    }catch(error){
        console.error(error);
        return [false,error];
    }
};
/**
 * method pull business basic information that includes name & media count.
**/
module.exports.instagramProfile = async(accessToken) => {
    try {
        const response = await axios.get(`https://graph.instagram.com/v21.0/me`, {
            params: {
                fields: 'id,user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count',
                access_token: accessToken
            }
        });
        const userProfile = response.data;
        return [true,userProfile];
    }catch(error){
        console.error('Error fetching Instagram user profile:', error.message);
        return [false,error.message];
    }
};
/**
 * method generate a longLivedToken in exchange of shortLivedToken.
**/
module.exports.getLongLivedAccessToken = async(shortLivedToken) => {
    try {
        const response = await axios.get('https://graph.instagram.com/access_token', {
             params: {
                 grant_type: 'ig_exchange_token',		
                 client_secret: INSTAGRAM_CLIENT_SECRET,
                 access_token: shortLivedToken
             }
        });
        const longLivedToken = response.data.access_token;
	const tokenExpiryTime = Date.now() + response.data.expires_in * 1000;    
        console.log('Long-lived Access Token:', longLivedToken, '  ', tokenExpiryTime);
        return longLivedToken;
    }catch (error){
        console.error('Error exchanging for long-lived access token:', error.response.data);
        return null;
    }
};
/**
 * method to renew access token.
**/
module.exports.refreshLongLivedAccessToken = async(accessToken) => {
    try {
        const response = await axios.get('https://graph.instagram.com/refresh_access_token', {
            params: {
                grant_type: 'ig_refresh_token',
                access_token: accessToken
            }
        });
        const newLongLivedToken = response.data.access_token;
        const tokenExpiryTime = Date.now() + response.data.expires_in * 1000;
        console.log('Refreshed Long-lived Access Token:', newLongLivedToken,'  ',tokenExpiryTime);
	return newLongLivedToken;    
    }catch(error) {
        console.error('Error refreshing long-lived access token:', error.response.data);
	return null;
    }
};

module.exports.revokeInstagramAccess = async(userInstagramID,accessToken) => {
    const url = `https://graph.instagram.com/v21.0/${userInstagramID}/permissions`;
    try{
        const response = await axios.delete(url,{params:{access_token: accessToken}});
        console.log('Access revoked:', response.data);
        return [true,response.data];
    }catch(error) {
        console.error('Error revoking access:', error.response.data);
        return [false,error.response.data];
    }
};

module.exports.instagramMedia = async(userInstagramID,accessToken) => {
    const url = `https://graph.instagram.com/${userInstagramID}/media?fields=id,caption,media_type,media_url,permalink&access_token=${accessToken}`;
    console.log(url);
    try{
        const mediaResponse = await axios.get(url);
        console.log('Media:', mediaResponse.data);
        return [true,mediaResponse.data];
    }catch(error) {
        console.error('Error:', error.response.data);
        return [false,error.response.data];
    }
};
