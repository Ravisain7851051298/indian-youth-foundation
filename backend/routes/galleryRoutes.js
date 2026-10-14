const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

router.get('/', galleryController.getGallery);
router.post('/', verifyToken, requireRole(['admin', 'manager']), handleOptionalFileUpload, galleryController.createGallery);
router.put('/:id', verifyToken, requireRole(['admin', 'manager']), handleOptionalFileUpload, galleryController.updateGallery);
router.delete('/:id', verifyToken, requireRole(['admin']), galleryController.deleteGallery);

module.exports = router;
