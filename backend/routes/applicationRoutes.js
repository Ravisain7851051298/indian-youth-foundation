const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken, requireRole } = require('../middlewares/auth');

// Applications listing (Admin / Manager)
router.get('/members', verifyToken, requireRole(['admin', 'manager']), applicationController.getMembershipApplications);
router.get('/volunteers', verifyToken, requireRole(['admin', 'manager']), applicationController.getVolunteerApplications);

// Approval & Rejection workflows (Admin)
router.put('/members/:id/approve', verifyToken, requireRole(['admin']), applicationController.approveMembershipApplication);
router.put('/members/:id/reject', verifyToken, requireRole(['admin']), applicationController.rejectMembershipApplication);

router.put('/volunteers/:id/approve', verifyToken, requireRole(['admin']), applicationController.approveVolunteerApplication);
router.put('/volunteers/:id/reject', verifyToken, requireRole(['admin']), applicationController.rejectVolunteerApplication);

module.exports = router;
