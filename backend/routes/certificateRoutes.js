const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { verifyToken, optionalAuth, requireRole } = require('../middlewares/auth');

router.get('/', optionalAuth, certificateController.getCertificates);
router.get('/:id/download', optionalAuth, certificateController.downloadCertificate);
router.get('/:id/pdf', optionalAuth, certificateController.downloadCertificate);
router.post('/', verifyToken, requireRole(['admin', 'Admin']), certificateController.issueCertificate);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), certificateController.deleteCertificate);

module.exports = router;
