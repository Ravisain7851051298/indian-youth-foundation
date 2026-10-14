const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');

// Dynamic Admin Account Creation (Requires X-ADMIN-SECRET-KEY, strictly prohibits default values)
router.post('/create-admin', authController.createAdmin);
router.post('/register-admin', authController.createAdmin); // alias

// Public Registration & Authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

// Session Termination & Token Invalidation (TTL Blacklist + Cookie Clearance)
router.post('/logout', (req, res, next) => {
  // Gracefully handle logout even if token expired
  verifyToken(req, res, () => {
    authController.logout(req, res, next);
  }).catch(() => {
    authController.logout(req, res, next);
  });
});

// Session State & Profile Verification
router.get('/verify-session', verifyToken, authController.verifySession);
router.get('/me', verifyToken, authController.getMe);
router.put('/profile', verifyToken, authController.updateProfile);

// Password Recovery Workflow
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
