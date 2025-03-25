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

const uploadStorage = multer({ storage });

module.exports = uploadStorage;
