
const { db } = require("../../models");

const OTPs = db.otps;

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
}