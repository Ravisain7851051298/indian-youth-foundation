const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const { upload } = require('../middlewares/upload');

// Helper to handle Multer validation errors gracefully
const wrapSingleUpload = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size exceeds maximum allowed limit of 15MB'
          });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ success: false, message: err.message || 'File upload rejected' });
    }
    next();
  });
};

const wrapMultipleUpload = (req, res, next) => {
  upload.array('files', 10)(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'One or more files exceed the maximum allowed size of 15MB'
          });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ success: false, message: err.message || 'Files upload rejected' });
    }
    next();
  });
};

// Upload routes
router.post('/', wrapSingleUpload, uploadController.handleUpload);
router.post('/multiple', wrapMultipleUpload, uploadController.handleUploadMultiple);

// File deletion endpoints
router.delete('/', uploadController.handleDeleteFile);
router.delete('/{*filename}', uploadController.handleDeleteFile);

// Storage stats endpoint for admin review
router.get('/stats', uploadController.getStorageStats);

module.exports = router;
