const { db } = require("../../models");

const OTPs = db.otps;

module.exports.purgeOtp = async(email) => {
    OTPs.destroy({
        where: {
           email: email
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