const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${req.originalUrl.split('/')[1]}-${uuidv4()}${path.extname(
        file.originalname
      )}`
    );
  },
});
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb({ msg: 'Upload correct files format', name: 'upload-err' }, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: multerFilter,
});

module.exports = upload;
