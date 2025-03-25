const { validationResult } = require("express-validator");
const { getInstagramToken, instagramMedia } = require("../../services/INSTAGRAM");
const { getLatestUserInstagramActivityLog } = require("../user/get.user.instagram.activity.log");
const { deleteUserInstagramActivityLog } = require("../user/instagram/delete.user.instagram.activity.log");
const { getUserInstagramIdByReferenceNo } = require("../user/get.user.instagram.id.by.reference.no");

exports.GetInstagramMedia = async(req,res) => {
    const code = req.query.code;
    const error = req.query.error;
    const error_reason = req.query.error_reason;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        if(error && error_reason === 'user_denied'){
            res.status(403).send({
                success: false,
                error: true,               
                message: 'Access denied. Please try again later.'
            });
        }else{
            const tokenResponse = await getInstagramToken(code,"authorize_media");
            if(tokenResponse[0]){
                const reference_number = await getLatestUserInstagramActivityLog();
                if(reference_number && reference_number?.length > 0){
                    const userInstagramDetails = await getUserInstagramIdByReferenceNo(reference_number);
                    const userInstagramID = JSON.parse(userInstagramDetails)._profile_data.id;
                    const media = await instagramMedia(userInstagramID,tokenResponse[1]);
                    //-.clean up.
                    await deleteUserInstagramActivityLog(reference_number,"authorize_media");
                    res.status(200).json({
                        success: true,
                        error: false,
                        data: media[1],
                        message: 'Media information'
                    });
                }else{
                    res.status(404).json({
                        success: false,
                        error: true,
                        message: "Reference number not found."
                    }); 
                }
            }else{
                res.status(400).json({
                    success: false,
                    error: true,
                    message: tokenResponse[1]
                });
            }
        }
    }else{
        res.status(422).json({ success: false, error: true, message: errors.array() });
    }
};
