const { db2 } = require("../../../models");

const Instagrams = db2.instagrams;

module.exports.userDeletionByReferenceNumber = async(reference_number) => {
    try{
        const isUpdated = await Instagrams.update({is_revoked:1,is_deleted:1},{where:{reference_number:reference_number}});
        if(!isUpdated){
            return false;
        }else{
            return true;
        }
    }catch(error){
        return false;
    }  
};