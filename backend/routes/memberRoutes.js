const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const applicationController = require('../controllers/applicationController');
const { verifyToken, requireRole } = require('../middlewares/auth');

// Apply for membership (authenticated user)
router.post('/apply', verifyToken, applicationController.applyMembership);

// Member directory & management
router.get('/', verifyToken, requireRole(['admin', 'manager', 'coordinator']), memberController.getMembers);
router.put('/:id/status', verifyToken, requireRole(['admin']), memberController.updateMemberStatus);
router.put('/:id/verify', verifyToken, requireRole(['admin', 'manager']), memberController.verifyMember);
router.get('/export/excel', verifyToken, requireRole(['admin']), memberController.exportMembersExcel);

module.exports = router;
