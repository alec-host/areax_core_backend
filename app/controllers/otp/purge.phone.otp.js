const { db } = require("../../models");

const OTPs = db.otps;

module.exports.purgeOtp = async(phone) => {
    OTPs.destroy({
        where: {
           phone: phone
        }
     }).then(function(rowDeleted){
       if(rowDeleted === 1){
          return true;
        }
     }, function(err){
         console.error(error);
         return false;
     });
};

