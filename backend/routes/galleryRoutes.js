const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

router.get('/', galleryController.getGallery);
router.post('/', verifyToken, requireRole(['admin', 'Admin']), handleOptionalFileUpload, galleryController.createGallery);
router.put('/:id', verifyToken, requireRole(['admin', 'Admin']), handleOptionalFileUpload, galleryController.updateGallery);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), galleryController.deleteGallery);

module.exports = router;
