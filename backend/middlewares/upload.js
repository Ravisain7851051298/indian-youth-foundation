const multer = require('multer');
const path = require('path');
const { uploadDir, ensureCategoryDir, sanitizeCategory } = require('../utils/fileCleaner');

/**
 * Categorized disk storage engine for Multer
 * Automatically creates and places files into categorized folders:
 * /uploads/avatars, /uploads/payments, /uploads/applications, etc.
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine category from body, query, header, or fieldname
    const rawCategory = req.body?.category 
      || req.query?.category 
      || req.headers?.['x-upload-category'] 
      || req.headers?.['x-category'] 
      || file.fieldname 
      || 'general';

    const { category, dir } = ensureCategoryDir(rawCategory);
    file.category = category;
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const rawName = file.originalname || 'upload.png';
    const cleanName = rawName.replace(/[^a-zA-Z0-9.]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e5);
    const ext = path.extname(cleanName) || '.png';
    const baseName = path.basename(cleanName, ext).substring(0, 40) || 'file';
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Allowed extensions for NGO operations: images, videos, PDFs, office docs
  const allowedExts = /\.(jpg|jpeg|png|webp|svg|gif|pdf|doc|docx|xls|xlsx|mp4|webm|mov|mkv|avi|3gp)$/i;
  const allowedMimes = /^(image\/(jpeg|png|webp|svg\+xml|gif)|video\/(mp4|webm|quicktime|x-msvideo|x-matroska|3gpp)|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document|vnd\.ms-excel|vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet))$/i;

  if (file.originalname.match(allowedExts) || file.mimetype.match(allowedMimes)) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file type: ${file.originalname}. Allowed: Images (JPG, PNG, WEBP), Videos (MP4, WEBM, MOV), PDFs, and Documents.`), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 60 * 1024 * 1024 // 60MB max file size for videos and documents
  },
  fileFilter: fileFilter
});

/**
 * Middleware that seamlessly accepts optional file upload(s) in the same API request.
 * Automatically handles both JSON and multipart/form-data.
 * Sets req.body.idProofUrl, req.body.idProofDocument, req.body.paymentScreenshot, or req.body.fileUrl.
 */
const handleOptionalFileUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'Uploaded file exceeds 15MB limit' });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ success: false, message: err.message || 'File upload rejected' });
    }

    if (req.files && req.files.length > 0) {
      req.file = req.files[0];

      req.files.forEach((f) => {
        const cat = f.category || 'general';
        const fileUrl = `/uploads/${cat}/${f.filename}`;
        const fname = (f.fieldname || '').toLowerCase();

        if (fname.includes('photo') || fname.includes('avatar') || fname === 'userimage') {
          req.body.photoUrl = fileUrl;
        } else if (fname.includes('front') || fname === 'documentfront' || fname === 'idprooffront') {
          req.body.documentFront = fileUrl;
          if (!req.body.idProofUrl) req.body.idProofUrl = fileUrl;
          if (!req.body.idProofDocument) req.body.idProofDocument = fileUrl;
        } else if (fname.includes('back') || fname === 'documentback' || fname === 'idproofback') {
          req.body.documentBack = fileUrl;
        } else if (fname.includes('payment') || fname.includes('screenshot') || fname === 'receipt') {
          req.body.paymentScreenshot = fileUrl;
        } else if (fname.includes('idproof') || fname.includes('document')) {
          if (!req.body.documentFront) req.body.documentFront = fileUrl;
          if (!req.body.idProofUrl) req.body.idProofUrl = fileUrl;
          if (!req.body.idProofDocument) req.body.idProofDocument = fileUrl;
        } else {
          if (!req.body.fileUrl) req.body.fileUrl = fileUrl;
        }
      });

      // Backward compatibility fallback for single file upload without specific fieldname
      if (req.files.length === 1) {
        const defaultUrl = `/uploads/${req.file.category || 'general'}/${req.file.filename}`;
        if (!req.body.idProofUrl && !req.body.idProofDocument && !req.body.documentFront) {
          req.body.idProofUrl = defaultUrl;
          req.body.idProofDocument = defaultUrl;
          req.body.documentFront = defaultUrl;
        }
        if (!req.body.paymentScreenshot && !req.body.screenshot) {
          req.body.paymentScreenshot = defaultUrl;
        }
        if (!req.body.fileUrl) {
          req.body.fileUrl = defaultUrl;
        }
      }
    }
    next();
  });
};

module.exports = {
  upload,
  uploadDir,
  handleOptionalFileUpload
};
