const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const eventController = require('../controllers/eventController');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

const JWT_SECRET = process.env.JWT_SECRET || 'byk_super_secret_jwt_key_2026_trust_secure';

const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.get('Authorization');
    const token = (req.cookies && (req.cookies.byk_token || req.cookies.token))
      || (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1])
      || (req.signedCookies && req.signedCookies.byk_token);

    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    }
  } catch (err) {
    // Non-blocking for public requests
  }
  next();
};

// Public Routes
router.get('/', eventController.getEvents);
router.get('/:id', eventController.getEventById);
router.post('/:id/join', optionalAuth, eventController.joinEvent);

// Admin / Manager Routes
router.post('/', verifyToken, requireRole(['admin', 'Admin']), handleOptionalFileUpload, eventController.createEvent);
router.put('/:id', verifyToken, requireRole(['admin', 'Admin']), handleOptionalFileUpload, eventController.updateEvent);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), eventController.deleteEvent);

// Attendee Management Routes
router.get('/:id/attendees', verifyToken, requireRole(['admin', 'Admin']), eventController.getEventAttendees);
router.delete('/:id/attendees/:attendeeId', verifyToken, requireRole(['admin', 'Admin']), eventController.removeAttendee);

module.exports = router;
