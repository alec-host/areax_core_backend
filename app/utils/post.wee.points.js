const axiosInstance = require('./axios.instance');
const API_ENDPOINT_URL = 'https://api.projectw.ai/weepoints/collect-referral-friendPoints';
const { API_GATEWAY_SECRET } = require('../constants/app_constants.js');

module.exports.postReferralDataForWeePointReward = async (payload) => {
   try {
      const requestPayload = {
         refree_userEmail: payload.referee_email,
         referrer_userEmail: payload.referrer_email
      };

      const response = await axiosInstance.post(API_ENDPOINT_URL, requestPayload, {
         headers: {
            'Authorization': API_GATEWAY_SECRET,
            'Content-Type': 'application/json' // Axios sets this automatically for objects, but you can be explicit
         }
      });

      return [true, response.data];
   } catch (error) {
      console.error("Referral Post Error:", error?.message);
      return [false, error?.message];
   }
};
