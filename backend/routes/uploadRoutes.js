const fs = require('fs');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');
const { upload } = require('../middlewares/upload');

// Helper to handle Multer validation errors gracefully for single or any file uploads
const wrapSingleUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size exceeds maximum allowed limit of 60MB'
          });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ success: false, message: err.message || 'File upload rejected' });
    }
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
      // Critical safeguard: If client accidentally sent redundant file fields (e.g. 'file' AND 'photo'),
      // or if multiple files were posted to this single-file endpoint, keep only the first file
      // and delete all extra duplicate files from disk immediately!
      if (req.files.length > 1) {
        for (let i = 1; i < req.files.length; i++) {
          try {
            const extraFile = req.files[i];
            if (extraFile && extraFile.path && fs.existsSync(extraFile.path)) {
              fs.unlinkSync(extraFile.path);
            }
          } catch (e) {
            console.error('Error cleaning duplicate upload file:', e);
          }
        }
        req.files = [req.files[0]];
      }
    }
    next();
  });
};

const wrapMultipleUpload = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'One or more files exceed the maximum allowed size of 60MB'
          });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ success: false, message: err.message || 'Files upload rejected' });
    }
    next();
  });
};

// Upload routes (with category parameter support)
router.post('/multiple', wrapMultipleUpload, uploadController.handleUploadMultiple);
router.post('/:category/multiple', wrapMultipleUpload, uploadController.handleUploadMultiple);
router.post('/:category', wrapSingleUpload, uploadController.handleUpload);
router.post('/', wrapSingleUpload, uploadController.handleUpload);

// File deletion endpoints
router.delete('/', uploadController.handleDeleteFile);
router.delete('/{*filename}', uploadController.handleDeleteFile);

// Storage stats endpoint for admin review
router.get('/stats', uploadController.getStorageStats);

module.exports = router;
