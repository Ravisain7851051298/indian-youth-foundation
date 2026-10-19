const express = require('express');
const router = express.Router();
const emailLogController = require('../controllers/emailLogController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/', verifyToken, requireRole(['admin', 'Admin']), emailLogController.getEmailLogs);

module.exports = router;
