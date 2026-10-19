const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

// Applications creation (Member & Volunteer) with single-API file upload
router.post('/members', verifyToken, handleOptionalFileUpload, applicationController.applyMembership);
router.post('/apply', verifyToken, handleOptionalFileUpload, applicationController.applyMembership);
router.post('/volunteers', verifyToken, handleOptionalFileUpload, applicationController.applyVolunteer);

// Applications listing (Admin / Manager)
router.get('/members', verifyToken, requireRole(['admin']), applicationController.getMembershipApplications);
router.get('/memberships', verifyToken, requireRole(['admin']), applicationController.getMembershipApplications);
router.get('/admin/all', verifyToken, requireRole(['admin']), applicationController.getMembershipApplications);
router.get('/volunteers', verifyToken, requireRole(['admin']), applicationController.getVolunteerApplications);

// Approval & Rejection workflows (Admin)
router.put('/members/:id/approve', verifyToken, requireRole(['admin']), applicationController.approveMembershipApplication);
router.put('/members/:id/reject', verifyToken, requireRole(['admin']), applicationController.rejectMembershipApplication);
router.put('/volunteers/:id/approve', verifyToken, requireRole(['admin']), applicationController.approveVolunteerApplication);
router.put('/volunteers/:id/reject', verifyToken, requireRole(['admin']), applicationController.rejectVolunteerApplication);

// Deletion endpoints (Admin only)
router.delete('/members/:id', verifyToken, requireRole(['admin']), applicationController.deleteMembershipApplication);
router.delete('/memberships/:id', verifyToken, requireRole(['admin']), applicationController.deleteMembershipApplication);
router.delete('/volunteers/:id', verifyToken, requireRole(['admin']), applicationController.deleteVolunteerApplication);
router.delete('/:id', verifyToken, requireRole(['admin']), applicationController.deleteMembershipApplication);

module.exports = router;

