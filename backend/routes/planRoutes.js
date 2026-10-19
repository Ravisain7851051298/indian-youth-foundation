const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/', planController.getPlans);
router.post('/', verifyToken, requireRole(['admin', 'Admin']), planController.createPlan);
router.put('/:id', verifyToken, requireRole(['admin', 'Admin']), planController.updatePlan);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), planController.deletePlan);

module.exports = router;
