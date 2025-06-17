const path = require('path');
const sizeOf = require('image-size');
const { validationResult } = require("express-validator");
const { uploadImageToCustomStorage } = require('../../services/CUSTOM-STORAGE');
const { findUserCountByEmail } = require("../user/find.user.count.by.email");
const { findUserCountByReferenceNumber } = require("../user/find.user.count.by.reference.no");

module.exports.UploadImage = async(req, res) => {
    const { reference_number, email } = req.body;
    const errors = validationResult(req);
    if(errors.isEmpty()){
        try{
            const email_found = await findUserCountByEmail(email);
            if(email_found > 0){ 
		let reference_number_found;
		if(reference_number !== '1'){
		    reference_number_found = await findUserCountByReferenceNumber(reference_number);
		}else{
		    reference_number_found = 1;
		}
	
                if(reference_number_found > 0){
		    const uploadImageURL = [];	
		    const validFormats = ['.png','.jpg','jpeg','.webp','.gif','.mp4','.3gp','.mov','.avi','.wmv','.mkv'];	

                    if(!req.files || req.files.length === 0){
                        return res.status(400).json({ success: false, error: true, message: 'Missing file(s).' });
                    }
         
		    for(const file of req.files){
	
                       /*
		       const imagePath = file.path;
		       const dimensions = sizeOf(imagePath);
		       const aspectRatio = dimensions.width / dimensions.height;
                       if(aspectRatio !== 0.8 && aspectRatio !== 1.91) {
                           res.status(400).json({ success: false, error: true, message: 'Invalid image dimensions. The aspect ratio must be 4:5 or 1:91.' });
                           return;
                       }
		       */
			    
                       const ext = path.extname(file.originalname).toLowerCase();
                       if(!validFormats.includes(ext)) {
                           res.status(400).json({ success: false, error: true, message: 'Invalid format. Only image & vidoe format are accepted.'});
                           return;
                       }
                     
		       try{
                           const imageUrl = await uploadImageToCustomStorage(file.filename);
			   if(imageUrl){
			        uploadImageURL.push(imageUrl);
			   }else{
				return res.status(400).json({ success: false, error: true, message: 'Something went wrong while uploading the image.' });
			   }
		       }catch(err){
                           return res.status(500).json({ success: false, error: true, message: error.message });
		       }
                    }
                    res.status(200).json({
                        success: true,
                        error: false,
                        image_url: uploadImageURL,
                        message: 'File uploaded successfully.'
                    });			
                }else{
                    res.status(404).json({
                        success: false,
                        error: true,
                        message: "Reference number not found."
                    });           
                }
            }else{
                res.status(404).json({
                    success: false,
                    error: true,
                    message: "Email not found."
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
