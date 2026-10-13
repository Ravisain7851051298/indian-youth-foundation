const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { upload } = require('../middlewares/upload');

router.post('/', upload.single('file'), uploadController.handleUpload);
router.post('/multiple', upload.array('files', 10), uploadController.handleUploadMultiple);

module.exports = router;
