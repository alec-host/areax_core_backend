const { Op } = require("sequelize");
const { db2 } = require("../../../models");
const sequelize = require("../../../db/db");

const InstagramLongLivedToken = db2.instagrams.tokens;

module.exports.calculateInstagramTokenExpiry = async(reference_number) => {
    try {
        const results = await InstagramLongLivedToken.findAll({
          attributes: [
            [sequelize.literal('DATEDIFF(CURRENT_DATE, created_at)'), 'days_difference']
          ],
          where: {
            [Op.and]: [
              sequelize.literal('DATEDIFF(CURRENT_DATE, created_at) > 55'),
              sequelize.literal('DATEDIFF(CURRENT_DATE, created_at) <= 60'),
              { reference_number: reference_number }
            ]
          }
        });
        return results.map(result => result.get('days_difference'));
    }catch(error){
        console.error('Error fetching data:', error);
        return null;
    }
};
