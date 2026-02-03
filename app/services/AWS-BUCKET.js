const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const { AWS_BUCKET_ACCESS_KEY_ID, AWS_BUCKET_SECRET_ACCESS_KEY, AWS_BUCKET_REGION, AWS_BUCKET_NAME_1 } = require('../constants/app_constants');

AWS.config.update({
    accessKeyId: AWS_BUCKET_ACCESS_KEY_ID,
    secretAccessKey: AWS_BUCKET_SECRET_ACCESS_KEY,
    region: AWS_BUCKET_REGION
});

module.exports.awsBucket = (fileName,fileType,filePath) => {
    const s3 = new AWS.S3();
    return new Promise((resolve, reject) => {  
        fs.readFile(filePath, (err, data) => {
            if(err){
                console.error(err);
                return reject(err);
            }

            const params = {
                Bucket: AWS_BUCKET_NAME_1,
                Key: fileName,
                Body: data,
                ContentType: fileType,
                //ACL: 'public-read'
            };

            s3.upload(params, (err, data) => {
                if(err){
                    console.error(err);
                    return reject(err);
                }
                resolve(data.Location);
            });
        });
    });
};
