const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { getUserInstagramProfileByReferenceNo } = require("../user/instagram/get.mongo.instagram.profile.by.reference.no");

exports.GetInstagramProfileStats = async(req, res) => {
    const reference_number = req.query.reference_number;
    const email = req.query.email;

    const errors = validationResult(req);
    if(errors.isEmpty()){
        const email_found = await findUserCountByEmail(email);
        if(email_found > 0){
            const reference_number_found = await findUserCountByReferenceNumber(reference_number);
            if(reference_number_found > 0){
                const igStats = await getUserInstagramProfileByReferenceNo(reference_number);
                if(igStats){
                    res.status(200).json({
                        success: true,
                        error: false,
                        data: igStats,
                        message: 'Instagram profile information.'
                    });
                }else{
                    res.status(404).json({
                        success: false,
                        error: true,
                        data: null,
                        message: 'Instagram profile not found.'
                    });
                }
            }else{
                res.status(404).json({
                    success: false,
                    error: true,
                    message: 'Reference number not found.'
                });
            }
        }else{
            res.status(404).json({
                success: false,
                error: true,
                message: 'Email not found.'
            });
        }
    }else{
        res.status(422).json({ success: false, error: true, message: errors.array() });
    }
};
