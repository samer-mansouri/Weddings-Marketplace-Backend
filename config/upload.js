const multer = require('multer');

const profilePicStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/profile_pictures/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});


const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadProfilePicture = multer({
  storage: profilePicStorage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});


module.exports = {
    uploadProfilePicture,
}