const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/', planController.getPlans);
router.post('/', verifyToken, requireRole(['admin']), planController.createPlan);
router.put('/:id', verifyToken, requireRole(['admin']), planController.updatePlan);
router.delete('/:id', verifyToken, requireRole(['admin']), planController.deletePlan);

module.exports = router;
