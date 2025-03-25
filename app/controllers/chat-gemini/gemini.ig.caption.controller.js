const path = require('path');
const { validationResult } = require("express-validator");
const { uploadImageToCustomStorage } = require('../../services/CUSTOM-STORAGE');
const { findUserCountByEmail } = require('../user/find.user.count.by.email');
const { findUserCountByReferenceNumber } = require('../user/find.user.count.by.reference.no');
const { INSTAGRAM_CAPTION_PROMPTING } = require('../../prompt/prompts');
const { geminiClient } = require("../../services/GEMINI");
const sizeOf = require('image-size');

module.exports.GeminiInstagramCaptionGenerator = async(req, res) => {
  const { reference_number, email } = req.body;
  console.log('XDDDDDDDDDDDDDDDDDDDDD ', req.body);	
  const errors = validationResult(req);
  if(errors.isEmpty()){
    try{
      const email_found = await findUserCountByEmail(email);
      if(email_found > 0){
        const reference_number_found = await findUserCountByReferenceNumber(reference_number);
        if(reference_number_found > 0){
          if(!req.file){
            return res.status(400).json({ success: false, error: true, message: 'Missing image file.' });
          }
          console.log('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx ',req.file);
          const imagePath = req.file.path;
          console.log('PATH ', imagePath);		
	  //-.check image dimensions.
          const dimensions = sizeOf(imagePath);
          const aspectRatio = dimensions.width / dimensions.height;
          if(aspectRatio !== 0.8 && aspectRatio !== 1.91) {
             res.status(400).json({ success: false, error: true, message: 'Invalid image dimensions. The aspect ratio must be 4:5 or 1:91.' });
             return;
          }
          		
          const ext = path.extname(req.file.originalname);
          if(ext !== '.jpg'){
             res.status(400).json({ success: false, error: true, message: 'Invalid image format. Only .jpg images are accepted.'});
             return; 
	  }

          const file = req.file;
          console.log('FILE ', file);		
          const imageUrl = await uploadImageToCustomStorage(file.filename);
          console.log('URL ', imageUrl);		
          if(imageUrl){
              try{
                const aiResponse = await geminiClient(imageUrl);
                if(aiResponse[0]){
                  res.status(200).json({
                    success: true, 
                    error: false, 
                    data: aiResponse[1],
                    message: 'Image uploaded successfully.'
                  });
                }else{
                  res.status(400).json({
                    success: true, 
                    error: false,
                    message: aiResponse[1]
                  });
                }
              }catch(error){
                res.status(error.status).json({
                  success: true, 
                  error: false,
                  message: error.message
                });
              }           	  
          }else{
            res.status(400).json({
              success: false,
              error: true,
              message: "Something wrong has happened."
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
