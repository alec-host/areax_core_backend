const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
});

const uploadFile = multer({ storage: storage });

module.exports = uploadFile;