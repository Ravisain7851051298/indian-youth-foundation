const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { optionalAuth } = require('../middlewares/auth');

// ID Card Download routes
router.get('/id-card/download', optionalAuth, documentController.downloadIdCardPdf);
router.get('/id-card/:id/download', optionalAuth, documentController.downloadIdCardPdf);
router.get('/id-card/pdf', optionalAuth, documentController.downloadIdCardPdf);
router.get('/id-card/:id/pdf', optionalAuth, documentController.downloadIdCardPdf);
router.get('/id-card', optionalAuth, documentController.downloadIdCardPdf);

// Appointment & Offer Letter Download routes
router.get('/appointment-letter/download', optionalAuth, documentController.downloadAppointmentLetterPdf);
router.get('/appointment-letter/:id/download', optionalAuth, documentController.downloadAppointmentLetterPdf);
router.get('/appointment-letter/pdf', optionalAuth, documentController.downloadAppointmentLetterPdf);
router.get('/appointment-letter/:id/pdf', optionalAuth, documentController.downloadAppointmentLetterPdf);
router.get('/appointment-letter', optionalAuth, documentController.downloadAppointmentLetterPdf);

// Offer letter alias for volunteers
router.get('/offer-letter/download', optionalAuth, (req, res, next) => {
  req.query.type = 'volunteer';
  return documentController.downloadAppointmentLetterPdf(req, res, next);
});
router.get('/offer-letter/:id/download', optionalAuth, (req, res, next) => {
  req.query.type = 'volunteer';
  return documentController.downloadAppointmentLetterPdf(req, res, next);
});

module.exports = router;

