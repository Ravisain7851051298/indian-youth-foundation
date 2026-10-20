const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { verifyToken, optionalAuth, requireRole } = require('../middlewares/auth');

router.get('/', optionalAuth, settingController.getSettings);
router.put('/', verifyToken, requireRole(['admin', 'Admin']), settingController.updateSettings);
router.post('/test-email', verifyToken, requireRole(['admin', 'Admin']), settingController.testEmailConnection);
router.post('/test-smtp', verifyToken, requireRole(['admin', 'Admin']), settingController.testEmailConnection);
router.post('/view', settingController.incrementPageView);

module.exports = router;
