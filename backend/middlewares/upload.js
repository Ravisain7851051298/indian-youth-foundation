const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const cleanName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e5);
    const ext = path.extname(cleanName) || '.png';
    const baseName = path.basename(cleanName, ext);
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images, pdfs, and documents
  const allowed = /\.(jpg|jpeg|png|webp|svg|pdf|docx|xlsx)$/i;
  if (file.originalname.match(allowed)) {
    cb(null, true);
  } else {
    cb(null, true); // Permissive for NGO forms
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max file size
  fileFilter: fileFilter
});

module.exports = {
  upload,
  uploadDir
};
