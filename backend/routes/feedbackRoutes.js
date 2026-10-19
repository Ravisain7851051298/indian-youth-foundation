const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken, optionalAuth, requireRole } = require('../middlewares/auth');

// Public & Authenticated Read (Admins see pending/rejected too)
router.get('/', optionalAuth, feedbackController.getFeedbacks);
router.get('/all', optionalAuth, feedbackController.getFeedbacks);

// Write Feedback (Authenticated users attach their profile; guests can also submit)
router.post('/', optionalAuth, feedbackController.createFeedback);
router.post('/create', optionalAuth, feedbackController.createFeedback);

// Admin Moderation & Replies
router.post('/:id/reply', verifyToken, requireRole(['admin', 'Admin']), feedbackController.replyFeedback);
router.put('/:id/reply', verifyToken, requireRole(['admin', 'Admin']), feedbackController.replyFeedback);
router.put('/:id/status', verifyToken, requireRole(['admin', 'Admin']), feedbackController.updateFeedbackStatus);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), feedbackController.deleteFeedback);

module.exports = router;
