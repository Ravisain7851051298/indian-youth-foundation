const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { verifyToken, optionalAuth, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

// Donation creation, submission, and verification support optionalAuth (guest donors without login & registered users)
router.post('/create-order', optionalAuth, donationController.createDonationOrder);
router.post('/submit', optionalAuth, handleOptionalFileUpload, donationController.submitDonation);
router.post('/', optionalAuth, handleOptionalFileUpload, donationController.submitDonation);
router.post('/verify', optionalAuth, handleOptionalFileUpload, donationController.verifyAndRecordDonation); // Alias
router.get('/', verifyToken, donationController.getDonations); // Filters to user's donations unless Admin/Manager
router.put('/:id/approve', verifyToken, requireRole(['admin', 'Admin']), donationController.approveDonation);
router.put('/:id/reject', verifyToken, requireRole(['admin', 'Admin']), donationController.rejectDonation);
router.get('/export/excel', verifyToken, requireRole(['admin', 'Admin']), donationController.exportDonationsExcel);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), donationController.deleteDonation);

module.exports = router;
