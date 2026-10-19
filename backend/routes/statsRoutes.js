const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/coordinator-report', verifyToken, requireRole(['admin', 'Admin']), memberController.getCoordinatorReport);
router.get('/coordinator-leaderboard', verifyToken, requireRole(['admin', 'Admin']), memberController.getAllCoordinatorsStats);

module.exports = router;
