const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const certificateController = require('../controllers/certificateController');
const donationController = require('../controllers/donationController');

router.get('/member/:id', memberController.verifyPublicMember);
router.get('/coordinator/:id', memberController.verifyPublicMember);
router.get('/volunteer/:id', memberController.verifyPublicMember);
router.get('/certificate/:id', certificateController.verifyPublicCertificate);
router.get('/donation/:receiptNo', donationController.verifyPublicDonation);

module.exports = router;
