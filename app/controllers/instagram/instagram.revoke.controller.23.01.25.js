const { validationResult } = require("express-validator");
const { getInstagramToken } = require("../../services/INSTAGRAM");
const { getUserInstagramIdByReferenceNo } = require("../user/get.user.instagram.id.by.reference.no");
const { getLatestUserInstagramActivityLog } = require("../user/get.user.instagram.activity.log");
const { deleteUserInstagramActivityLog } = require("../user/instagram/delete.user.instagram.activity.log");
const { userDeletionByReferenceNumber } = require("../user/instagram/mark.deleted.user.instagram.data");

exports.InstagramRevoke = async(req,res) => {
    const code = req.query.code;
    const error = req.query.error;
    const error_reason = req.query.error_reason;
    const errors = validationResult(req)
    if(errors.isEmpty()){
        if(error && error_reason === 'user_denied'){
            res.status(403).send({
                success: false,
                error: true,               
                message: 'Access denied. Please try again later.'
            });
        }else{
            const tokenResponse = await getInstagramToken(code,"deauthorize");
            if(tokenResponse[0]){
                const reference_number = await getLatestUserInstagramActivityLog();
                if(reference_number && reference_number?.length > 0){
                    const userInstagramDetails = await getUserInstagramIdByReferenceNo(reference_number);
                    if(userInstagramDetails.length > 0){
                        const response = await userDeletionByReferenceNumber(reference_number);
                        if(response){
                            //-.clean up.
                            await deleteUserInstagramActivityLog(reference_number,"deauthorize");
                            res.status(200).json({
                                success: true,
                                error: false,
                                message: 'You have already allowed AreaX to access your Instagram acccount.'
                            });
                        }else{
                            res.status(400).json({
                                success: false,
                                error: true,
                                message: 'Failed to delete user\'s Instagram data.'
                            });
                        }
                    }else{
                        res.status(404).json({
                            success: false,
                            error: true,
                            message: 'User\'s Instagram ID not found.'
                        });        
                    }
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
        res.status(422).json({errors: errors.array()});
    }
};