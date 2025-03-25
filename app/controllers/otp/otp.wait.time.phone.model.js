const { db } = require("../../models");

const OTPs = db.otps;

module.exports.otpWaitTimeInMinutes = async(phone) => {
  try {
    const result = await OTPs.findOne({
      attributes: [
        [db.Sequelize.literal(`TIMESTAMPDIFF(MINUTE, created_at, NOW())`), 'time_in_minutes']
      ],
      where: {
        phone: phone
      },
      order: [['_id', 'DESC']]
    });
    return result;
  }catch(error){
    return [];
  }
};
