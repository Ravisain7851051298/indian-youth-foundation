const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const applicationController = require('../controllers/applicationController');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

// Apply for membership (authenticated user)
router.post('/apply', verifyToken, handleOptionalFileUpload, applicationController.applyMembership);
router.post('/', verifyToken, handleOptionalFileUpload, applicationController.applyMembership);

// Member directory & management
router.get('/', verifyToken, requireRole(['admin', 'manager', 'coordinator']), memberController.getMembers);
router.put('/:id/status', verifyToken, requireRole(['admin']), memberController.updateMemberStatus);
router.put('/:id/verify', verifyToken, requireRole(['admin', 'manager']), memberController.verifyMember);
router.get('/export/excel', verifyToken, requireRole(['admin']), memberController.exportMembersExcel);
router.delete('/:id', verifyToken, requireRole(['admin']), memberController.deleteMember);

module.exports = router;
