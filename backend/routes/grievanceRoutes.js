const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');
const { verifyToken, optionalAuth, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

router.post('/', optionalAuth, handleOptionalFileUpload, grievanceController.submitGrievance);
router.get('/admin/all', verifyToken, requireRole(['Admin', 'Manager']), grievanceController.getGrievances);
router.get('/', verifyToken, grievanceController.getGrievances);
router.put('/:id', verifyToken, requireRole(['Admin', 'Manager']), handleOptionalFileUpload, grievanceController.updateGrievance);
router.delete('/:id', verifyToken, requireRole(['Admin']), grievanceController.deleteGrievance);

module.exports = router;
