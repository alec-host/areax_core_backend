const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { awsBucket } = require("../../services/AWS-BUCKET");
const { modifyUserByEmail } = require("../user/modify.user.by.email");

module.exports.UploadProfilePicture = async(req,res) => {
    const { email, reference_number } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const email_found = await findUserCountByEmail(email);
            if(email_found > 0){
                const reference_number_found = await findUserCountByReferenceNumber(reference_number);
                if(reference_number_found > 0){
                    if(!req.file){
                        return res.status(400).json({ success: false, error: true, message: 'Missing Image file.' });
                    }
	            const { path, originalname,  mimetype } = req.file;
                    const imagePath = path;
                    const imageName = email.split('@')[0];
		    const originalnameArray = originalname.split('.');	
                    const fileType = originalnameArray[originalnameArray.length - 1];
                    awsBucket(imageName,fileType,imagePath).then(async fileUrl => {
                        const payload = { profile_picture_url: fileUrl };
                        await modifyUserByEmail(email, payload);			    
                        res.status(200).json({
                            success: true,
                            error: false,
                            file_url: fileUrl,
                            message: "Profile Image has been uploaded."
                        });
                    }).catch(err =>{
                        res.status(400).json({
                            success: false,
                            error: true,
                            file_url: [],
                            message: `Error uploading the image: ${err.message}.`
                        });
                    });
                }else{
                    res.status(404).json({
                        success: false,
                        error: true,
                        message: 'Reference no not found.'
                    });
                }
            }else{
                res.status(404).json({
                    success: false,
                    error: true,
                    message: 'Email not found.'
                });
            }
        }catch(error){
            console.error('Upload error:', error);
            res.status(500).json({ success: false, error: true,message:'An error occurred during the upload process.' });            
        }
    }else{
        res.status(422).json({errors: errors.array()});
    }
};
