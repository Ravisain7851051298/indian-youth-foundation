const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.post('/create-order', donationController.createDonationOrder);
router.post('/submit', donationController.submitDonation);
router.post('/verify', donationController.verifyAndRecordDonation); // Alias
router.get('/', verifyToken, requireRole(['admin', 'manager']), donationController.getDonations);
router.put('/:id/approve', verifyToken, requireRole(['admin']), donationController.approveDonation);
router.put('/:id/reject', verifyToken, requireRole(['admin']), donationController.rejectDonation);
router.get('/export/excel', verifyToken, requireRole(['admin']), donationController.exportDonationsExcel);

module.exports = router;
