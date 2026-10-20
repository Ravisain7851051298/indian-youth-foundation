const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const applicationController = require('../controllers/applicationController');
const { verifyToken, optionalAuth, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

// Apply for membership (Supports both guest applicants and authenticated users)
router.post('/apply', optionalAuth, handleOptionalFileUpload, applicationController.applyMembership);
router.post('/', optionalAuth, handleOptionalFileUpload, applicationController.applyMembership);

// Public Member Directory (sanitized, non-sensitive)
router.get('/public', memberController.getPublicMembers);

// Member directory & management (Admin/Coordinator with full details)
router.get('/', verifyToken, requireRole(['admin', 'Admin']), memberController.getMembers);
router.put('/:id/status', verifyToken, requireRole(['admin', 'Admin']), memberController.updateMemberStatus);
router.put('/:id/verify', verifyToken, requireRole(['admin', 'Admin']), memberController.verifyMember);
router.put('/:id/approve', verifyToken, requireRole(['admin', 'Admin']), applicationController.approveMembershipApplication);
router.put('/:id/reject', verifyToken, requireRole(['admin', 'Admin']), applicationController.rejectMembershipApplication);
router.get('/export/excel', verifyToken, requireRole(['admin', 'Admin']), memberController.exportMembersExcel);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), memberController.deleteMember);

module.exports = router;
