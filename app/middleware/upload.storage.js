const multer = require('multer');
const path = require('path');

const uploadDirectory = '/var/www/projectw.ai/html/image-storage';

//-.const storage = multer.memoryStorage();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${fileExt}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
    // Accept images, documents, and other common file types
    const allowedTypes = [	    
        'image/jpeg',
        'image/jpg',	    
        'image/png',
        'image/gif',
	'image/webp',
	'video/mp4',    
        'image/heic',
        'image/heif',
        'video/mp4',
        'video/quicktime',  // .mov files
        'video/x-msvideo',  // .avi files
        'video/x-matroska', // .mkv files
        'video/webm',
        'video/3gpp',      // .3gp files
        'video/x-ms-wmv'	    
    ];

    const maxSize = 50 * 1024 * 1024;	

    if (file.size > maxSize) {
        return cb(new Error('File size too large. Maximum size is 50MB.'), false);
    }

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and vidoes are allowed.'), false);
    }
};

const uploadStorage = multer({ 
    storage: storage,
    fileFilter: fileFilter,	
    limits: {
       fileSize: 50 * 1024 * 1024 //50MB limit    
    }	
});

module.exports = uploadStorage;
