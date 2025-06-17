const { validationResult } = require("express-validator");
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");
const { awsBucket } = require("../../services/AWS-BUCKET");
const { modifyUserByEmail } = require("../user/modify.user.by.email");
const { updateSingleUserProfileCache } = require("../../sync-cache-service/sync.service");

module.exports.UploadGaurdianPicture = async(req,res) => {
    const { email, reference_number, guardian_name } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       res.status(422).json({success: false, error: true, message: errors.array()});
       return;
    }
    try{
       const email_found = await findUserCountByEmail(email);
       if(email_found === 0){
           res.status(404).json({
               success: false,
               error: true,
               message: 'Email not found.'
           });	       
	   return;
       }
       const reference_number_found = await findUserCountByReferenceNumber(reference_number);
       if(reference_number_found === 0){
           res.status(404).json({
               success: false,
               error: true,
               message: 'Reference no not found.'
           });
	   return;
       }
       if(!req.file){
           return res.status(400).json({ success: false, error: true, message: 'Missing Image file.' });
       }
       const { path, originalname, mimetype } = req.file;
       const imagePath = path;
       const imageName = guardian_name+'-'+email.split('@')[0];
       const originalnameArray = originalname.split('.');
       const fileType = originalnameArray[originalnameArray.length - 1];
       awsBucket(imageName,fileType,imagePath).then(async fileUrl => {
           const payload = { guardian_picture_url: fileUrl };
           await modifyUserByEmail(email, payload);
           await updateSingleUserProfileCache(email);    
           res.status(200).json({
               success: true,
               error: false,
               file_url: fileUrl,
               message: "Spirit animal has been uploaded."
           });
       }).catch(err => {
           res.status(400).json({
               success: false,
               error: true,
               file_url: [],
               message: `Error uploading the image: ${err.message}.`
           });
       }); 
    }catch(error){
       console.error('Upload error:', error);
       res.status(500).json({ success: false, error: true, message:'An error occurred during the upload process.' });
    }
};
