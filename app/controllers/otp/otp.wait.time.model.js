
const { db } = require("../../models");

const OTPs = db.otps;
/*
module.exports.otpWaitTimeInMinutes = async(email) => {
  try {
    const result = await OTPs.findOne({
      attributes: [
        [db.Sequelize.literal(`TIMESTAMPDIFF(MINUTE, created_at, NOW())`), 'time_in_minutes']
      ],
      where: {
        email: email
      },
      order: [['_id', 'DESC']]
    });
    return result;
  }catch(error){
    return [];
  }
};
*/

module.exports.otpWaitTimeInMinutes = async (email) => {
  try {
    // Fetch the most recent OTP record for the given email
    const result = await OTPs.findOne({
      attributes: ['created_at', 'message', 'email'],	    
      where: { email },
      order: [['created_at', 'DESC']]
    });

    if (!result) {
      return null;
    }

    // Compute time difference in minutes in JS
    const createdAt = result.created_at;
    const diffMs = Date.now() - createdAt.getTime();
    const timeInMinutes = Math.floor(diffMs / 60000);

    // Attach the computed field to the result
    result.setDataValue('time_in_minutes', timeInMinutes);

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};
