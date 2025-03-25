const { db2 } = require("../../../models");

const InstagramActivityLogs = db2.instagrams.activities;

module.exports.deleteUserInstagramActivityLog = async(reference_number,operation_type) => {
    InstagramActivityLogs.destroy({
        where: {
            reference_number: reference_number,
            operation_type: operation_type
        }
     }).then(function(rowDeleted){
       if(rowDeleted === 1){
          return true;
        }
     }, function(err){
         console.error(err);
         return false;
     });
};