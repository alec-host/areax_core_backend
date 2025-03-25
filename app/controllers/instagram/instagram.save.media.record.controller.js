const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { saveInstagramMediaRecord } = require("../user/instagram/store.retrieve.mongo.instagram.media");

exports.SaveInstagramMediaRecord = async(req, res) => {
    const { email,reference_number,media_data } = req.body;

    const errors = validationResult(req);
    if(errors.isEmpty()){
        const email_found = await findUserCountByEmail(email);
        if(email_found > 0){
            const reference_number_found = await findUserCountByReferenceNumber(reference_number);
            if(reference_number_found > 0){
                const record = await saveInstagramMediaRecord(media_data);
                if(record){
                    res.status(200).json({
                        success: true,
                        error: false,
                        data: record,
                        message: 'Media record has been saved.'
                    });
                }else{
                    res.status(400).json({
                        success: false,
                        error: true,
                        data: null,
                        message: 'No media record has been saved'
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

