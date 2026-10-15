const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/', settingController.getSettings);
router.put('/', verifyToken, requireRole(['admin']), settingController.updateSettings);
router.post('/test-email', verifyToken, requireRole(['admin']), settingController.testEmailConnection);
router.post('/view', settingController.incrementPageView);

module.exports = router;
