const fs = require('fs');
const path = require('path');
const { uploadDir, deleteFileByUrl, VALID_CATEGORIES } = require('../utils/fileCleaner');

const handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file received for upload' });
    }

    const category = req.file.category || 'general';
    const fileUrl = `/uploads/${category}/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: `File successfully uploaded into uploads/${category} directory`,
      url: fileUrl,
      filename: req.file.filename,
      category: category,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const handleUploadMultiple = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files received for upload' });
    }

    const files = req.files.map(f => {
      const category = f.category || 'general';
      return {
        url: `/uploads/${category}/${f.filename}`,
        filename: f.filename,
        category: category,
        size: f.size,
        mimetype: f.mimetype
      };
    });

    return res.status(200).json({
      success: true,
      message: `${files.length} files successfully uploaded`,
      files
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Explicit file deletion endpoint
 * Allows frontend or admin to remove an uploaded file (e.g. before form submit)
 */
const handleDeleteFile = async (req, res) => {
  try {
    let rawTarget = req.body?.url 
      || req.query?.url 
      || req.body?.filename 
      || req.params?.filename 
      || req.params?.[0]
      || '';

    if (Array.isArray(rawTarget)) {
      rawTarget = rawTarget.join('/');
    }

    if (!rawTarget) {
      return res.status(400).json({ success: false, message: 'File URL or filename is required for deletion' });
    }

    const deleted = await deleteFileByUrl(rawTarget);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'File not found or already deleted from uploads'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'File successfully deleted from uploads directory',
      target: rawTarget
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Storage metrics endpoint for admin inspection
 */
const getStorageStats = async (req, res) => {
  try {
    const stats = {};
    let totalSize = 0;
    let totalFiles = 0;

    const categories = ['root', ...Array.from(VALID_CATEGORIES)];
    for (const cat of categories) {
      const catDir = cat === 'root' ? uploadDir : path.join(uploadDir, cat);
      if (fs.existsSync(catDir)) {
        const files = await fs.promises.readdir(catDir, { withFileTypes: true });
        const regularFiles = files.filter(f => f.isFile());
        let catSize = 0;
        for (const f of regularFiles) {
          const stat = await fs.promises.stat(path.join(catDir, f.name));
          catSize += stat.size;
        }
        stats[cat] = {
          count: regularFiles.length,
          sizeBytes: catSize,
          sizeMb: (catSize / (1024 * 1024)).toFixed(2)
        };
        totalSize += catSize;
        totalFiles += regularFiles.length;
      }
    }

    return res.json({
      success: true,
      summary: {
        totalFiles,
        totalSizeBytes: totalSize,
        totalSizeMb: (totalSize / (1024 * 1024)).toFixed(2)
      },
      categories: stats
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  handleUpload,
  handleUploadMultiple,
  handleDeleteFile,
  getStorageStats
};
