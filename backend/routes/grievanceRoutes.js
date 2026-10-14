const express = require('express');
const router = express.Router();
const grievanceController = require('../controllers/grievanceController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.post('/', grievanceController.submitGrievance);
router.get('/admin/all', verifyToken, requireRole(['admin', 'manager']), grievanceController.getGrievances);
router.get('/', verifyToken, requireRole(['admin', 'manager']), grievanceController.getGrievances);
router.put('/:id', verifyToken, requireRole(['admin', 'manager']), grievanceController.updateGrievance);
router.delete('/:id', verifyToken, requireRole(['admin']), grievanceController.deleteGrievance);

module.exports = router;

