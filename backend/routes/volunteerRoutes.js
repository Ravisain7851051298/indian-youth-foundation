const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

router.post('/apply', verifyToken, handleOptionalFileUpload, applicationController.applyVolunteer);
router.get('/admin/all', verifyToken, requireRole(['admin', 'Admin']), applicationController.getVolunteerApplications);
router.get('/all', verifyToken, requireRole(['admin', 'Admin']), applicationController.getVolunteerApplications);
router.get('/', verifyToken, requireRole(['admin', 'Admin']), applicationController.getVolunteerApplications);
router.put('/:id/approve', verifyToken, requireRole(['admin', 'Admin']), applicationController.approveVolunteerApplication);
router.put('/:id/reject', verifyToken, requireRole(['admin', 'Admin']), applicationController.rejectVolunteerApplication);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), applicationController.deleteVolunteerApplication);

module.exports = router;

