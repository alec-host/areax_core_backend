const { validationResult } = require("express-validator");
const { getLatestUserInstagramActivityLog } = require("../user/get.user.instagram.activity.log");
const { deleteUserInstagramActivityLog } = require("../user/instagram/delete.user.instagram.activity.log");
const { userDeletionByReferenceNumber } = require("../user/instagram/mark.deleted.user.instagram.data");

exports.DeauthorizeInstagramApp = async(req,res) => {
    const errors = validationResult(req);
    if(errors.isEmpty()){
        const reference_number = await getLatestUserInstagramActivityLog();
        if(reference_number && reference_number?.length > 0){
            await deleteUserInstagramActivityLog(reference_number,"deauthorize");
            await userDeletionByReferenceNumber(reference_number);
            res.status(200).json({
                success: true,
                error: false,
                message: 'Instagram app revoked.'
            });
        }else{
            res.status(200).json({
                success: true,
                error: false,
                message: 'Instagram app revoked.'
            });
        }
    }else{
        res.status(422).json({errors: errors.array()});
    }
};