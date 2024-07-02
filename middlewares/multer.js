const multer = require('multer');
const path = require('path');
const destination='uploads/profile_images/';

const storage = multer.diskStorage({
  destination: destination,
  filename:(req, file, cb)=>{
      return cb(null, `${file.fieldname}_${Date.now()}_${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 200000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
}
});
    

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

module.exports = upload;
