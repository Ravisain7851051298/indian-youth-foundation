const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { verifyToken, optionalAuth, requireRole } = require('../middlewares/auth');

router.get('/', optionalAuth, certificateController.getCertificates);
router.post('/', verifyToken, requireRole(['admin']), certificateController.issueCertificate);
router.delete('/:id', verifyToken, requireRole(['admin']), certificateController.deleteCertificate);

module.exports = router;
