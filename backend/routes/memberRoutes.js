const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const applicationController = require('../controllers/applicationController');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

// Apply for membership (authenticated user)
router.post('/apply', verifyToken, handleOptionalFileUpload, applicationController.applyMembership);
router.post('/', verifyToken, handleOptionalFileUpload, applicationController.applyMembership);

// Public Member Directory (sanitized, non-sensitive)
router.get('/public', memberController.getPublicMembers);

// Member directory & management (Admin/Coordinator with full details)
router.get('/', verifyToken, requireRole(['admin', 'Admin']), memberController.getMembers);
router.put('/:id/status', verifyToken, requireRole(['admin', 'Admin']), memberController.updateMemberStatus);
router.put('/:id/verify', verifyToken, requireRole(['admin', 'Admin']), memberController.verifyMember);
router.get('/export/excel', verifyToken, requireRole(['admin', 'Admin']), memberController.exportMembersExcel);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), memberController.deleteMember);

module.exports = router;
