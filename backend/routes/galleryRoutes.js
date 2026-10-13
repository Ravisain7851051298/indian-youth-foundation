const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/', galleryController.getGallery);
router.post('/', verifyToken, requireRole(['admin', 'manager']), galleryController.createGallery);
router.delete('/:id', verifyToken, requireRole(['admin']), galleryController.deleteGallery);

module.exports = router;
