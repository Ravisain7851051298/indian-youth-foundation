const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/', certificateController.getCertificates);
router.post('/', verifyToken, requireRole(['admin']), certificateController.issueCertificate);

module.exports = router;
