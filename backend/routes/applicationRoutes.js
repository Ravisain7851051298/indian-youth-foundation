const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken, optionalAuth, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

// Applications creation (Member & Volunteer) with single-API file upload - Supports guest applicants without login
router.post('/members', optionalAuth, handleOptionalFileUpload, applicationController.applyMembership);
router.post('/apply', optionalAuth, handleOptionalFileUpload, applicationController.applyMembership);
router.post('/volunteers', optionalAuth, handleOptionalFileUpload, applicationController.applyVolunteer);

// Applications listing (Admin / Manager)
router.get('/members', verifyToken, requireRole(['admin', 'Admin']), applicationController.getMembershipApplications);
router.get('/memberships', verifyToken, requireRole(['admin', 'Admin']), applicationController.getMembershipApplications);
router.get('/admin/all', verifyToken, requireRole(['admin', 'Admin']), applicationController.getMembershipApplications);
router.get('/volunteers', verifyToken, requireRole(['admin', 'Admin']), applicationController.getVolunteerApplications);

// Approval & Rejection workflows (Admin) - Supports PUT, POST, and PATCH
const methodNotAllowed = (action) => (req, res) => {
  res.status(405).json({
    success: false,
    message: `Method Not Allowed. To ${action} an application, please send a PUT or POST request with an authorized Admin Bearer token.`
  });
};

// Members: /members/:id/approve & /member/:id/approve
router.route(['/members/:id/approve', '/member/:id/approve'])
  .put(verifyToken, requireRole(['admin', 'Admin']), applicationController.approveMembershipApplication)
  .post(verifyToken, requireRole(['admin', 'Admin']), applicationController.approveMembershipApplication)
  .patch(verifyToken, requireRole(['admin', 'Admin']), applicationController.approveMembershipApplication)
  .get(methodNotAllowed('approve'));

// Members: /members/:id/reject & /member/:id/reject
router.route(['/members/:id/reject', '/member/:id/reject'])
  .put(verifyToken, requireRole(['admin', 'Admin']), applicationController.rejectMembershipApplication)
  .post(verifyToken, requireRole(['admin', 'Admin']), applicationController.rejectMembershipApplication)
  .patch(verifyToken, requireRole(['admin', 'Admin']), applicationController.rejectMembershipApplication)
  .get(methodNotAllowed('reject'));

// Volunteers: /volunteers/:id/approve & /volunteer/:id/approve
router.route(['/volunteers/:id/approve', '/volunteer/:id/approve'])
  .put(verifyToken, requireRole(['admin', 'Admin']), applicationController.approveVolunteerApplication)
  .post(verifyToken, requireRole(['admin', 'Admin']), applicationController.approveVolunteerApplication)
  .patch(verifyToken, requireRole(['admin', 'Admin']), applicationController.approveVolunteerApplication)
  .get(methodNotAllowed('approve'));

// Volunteers: /volunteers/:id/reject & /volunteer/:id/reject
router.route(['/volunteers/:id/reject', '/volunteer/:id/reject'])
  .put(verifyToken, requireRole(['admin', 'Admin']), applicationController.rejectVolunteerApplication)
  .post(verifyToken, requireRole(['admin', 'Admin']), applicationController.rejectVolunteerApplication)
  .patch(verifyToken, requireRole(['admin', 'Admin']), applicationController.rejectVolunteerApplication)
  .get(methodNotAllowed('reject'));

// Generic fallback: /:id/approve & /:id/reject
router.route('/:id/approve')
  .put(verifyToken, requireRole(['admin', 'Admin']), applicationController.approveMembershipApplication)
  .post(verifyToken, requireRole(['admin', 'Admin']), applicationController.approveMembershipApplication)
  .patch(verifyToken, requireRole(['admin', 'Admin']), applicationController.approveMembershipApplication)
  .get(methodNotAllowed('approve'));

router.route('/:id/reject')
  .put(verifyToken, requireRole(['admin', 'Admin']), applicationController.rejectMembershipApplication)
  .post(verifyToken, requireRole(['admin', 'Admin']), applicationController.rejectMembershipApplication)
  .patch(verifyToken, requireRole(['admin', 'Admin']), applicationController.rejectMembershipApplication)
  .get(methodNotAllowed('reject'));

// Deletion endpoints (Admin only)
router.delete('/members/:id', verifyToken, requireRole(['admin', 'Admin']), applicationController.deleteMembershipApplication);
router.delete('/memberships/:id', verifyToken, requireRole(['admin', 'Admin']), applicationController.deleteMembershipApplication);
router.delete('/volunteers/:id', verifyToken, requireRole(['admin', 'Admin']), applicationController.deleteVolunteerApplication);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), applicationController.deleteMembershipApplication);

module.exports = router;

