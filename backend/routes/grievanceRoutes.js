const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');
const { verifyToken, optionalAuth, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

router.post('/', optionalAuth, handleOptionalFileUpload, grievanceController.submitGrievance);
router.get('/admin/all', verifyToken, requireRole(['admin', 'Admin']), grievanceController.getGrievances);
router.get('/', optionalAuth, grievanceController.getGrievances);
router.put('/:id', verifyToken, requireRole(['admin', 'Admin']), handleOptionalFileUpload, grievanceController.updateGrievance);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), grievanceController.deleteGrievance);

module.exports = router;
