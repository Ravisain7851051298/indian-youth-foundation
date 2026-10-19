const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

// Donation creation, submission, and verification require authentication
router.post('/create-order', verifyToken, donationController.createDonationOrder);
router.post('/submit', verifyToken, handleOptionalFileUpload, donationController.submitDonation);
router.post('/', verifyToken, handleOptionalFileUpload, donationController.submitDonation);
router.post('/verify', verifyToken, handleOptionalFileUpload, donationController.verifyAndRecordDonation); // Alias
router.get('/', verifyToken, donationController.getDonations); // Filters to user's donations unless Admin/Manager
router.put('/:id/approve', verifyToken, requireRole(['admin', 'Admin']), donationController.approveDonation);
router.put('/:id/reject', verifyToken, requireRole(['admin', 'Admin']), donationController.rejectDonation);
router.get('/export/excel', verifyToken, requireRole(['admin', 'Admin']), donationController.exportDonationsExcel);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), donationController.deleteDonation);

module.exports = router;
