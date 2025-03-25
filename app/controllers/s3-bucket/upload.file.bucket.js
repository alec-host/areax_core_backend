const { validationResult } = require("express-validator");
const { awsBucket } = require("../../services/AWS-BUCKET");

module.exports.UploadFileToBucket = async(req, res) => {
    const { file_name,file_type } = req.body;	
    const errors = validationResult(req);

    console.log('XXXXXXcccc ', file_name);
    console.log('VVVVVVVVVVVv   ', file_type);
    console.log('XXXXXXccccnnnnnnnnnn ', req.file.path);	

    if (!req.file || !req.file.path) {
	return res.status(400).json({success: false, error: true, message: "No file has been uploaded"});
    }	
	
    if(!req.file){
	return res.status(400).json({
             success: false,
             error: true,
             message: 'No file uploaded.'
        });    
    }
    const file_path = req.file.path;
    if(errors.isEmpty()){
        awsBucket(file_name,file_type,file_path).then(fileUrl => {
            res.status(200).json({
                success: true,
                error: false,
                file_url: fileUrl,
                message: "File has been uploaded to Amazon S3 bucket."
            });
        }).catch(err =>{
            res.status(400).json({
                success: false,
                error: true,
                file_url: [],
                message: `Error uploading the file: ${err.message}.`
            });  
        });        
    }else{
        res.status(422).json({errors: errors.array()});
    }
};
