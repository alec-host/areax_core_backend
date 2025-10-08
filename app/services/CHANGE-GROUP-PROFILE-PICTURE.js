const axiosInstance = require("../utils/axios.instance");

const CHANGE_NOTIFICATION_URL = 'https://api.projectw.ai/social/api/v1/group/member/profile-picture';
module.exports.httpChangeGroupProfilePicture = async(payload) => {
  axiosInstance.patch(CHANGE_NOTIFICATION_URL,
     payload,
     {
        headers: {
           /*Authorization: IN_APP_AUTHORIZATION_KEY,*/
           "Content-Type": "application/json"
        },
        maxBodyLength: Infinity
     }).then(response => {
        console.log("Change group member profile picture:", response.data);
     }).catch(error => {
     console.error("Error:", error.response?.data || error.message);
  });
};
