const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const applicationRoutes = require('./applicationRoutes');
const donationRoutes = require('./donationRoutes');
const planRoutes = require('./planRoutes');
const memberRoutes = require('./memberRoutes');
const volunteerRoutes = require('./volunteerRoutes');
const certificateRoutes = require('./certificateRoutes');
const campaignRoutes = require('./campaignRoutes');
const eventRoutes = require('./eventRoutes');
const newsRoutes = require('./newsRoutes');
const galleryRoutes = require('./galleryRoutes');
const grievanceRoutes = require('./grievanceRoutes');
const auditRoutes = require('./auditRoutes');
const settingRoutes = require('./settingRoutes');
const emailLogRoutes = require('./emailLogRoutes');
const uploadRoutes = require('./uploadRoutes');
const verifyRoutes = require('./verifyRoutes');
const statsRoutes = require('./statsRoutes');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    ngo: 'भारतीय युवा क्रांति (Indian Youth Foundation)',
    version: '2.0.0'
  });
});

// Mount Resource Sub-routers
router.use('/auth', authRoutes);
router.use('/applications', applicationRoutes);
router.use('/donations', donationRoutes);
router.use('/plans', planRoutes);
router.use('/members', memberRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/certificates', certificateRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/events', eventRoutes);
router.use('/news', newsRoutes);
router.use('/gallery', galleryRoutes);
router.use('/grievances', grievanceRoutes);
router.use('/audit-reports', auditRoutes);
router.use('/settings', settingRoutes);
router.use('/email-logs', emailLogRoutes);
router.use('/uploads', uploadRoutes);
router.use('/upload', uploadRoutes); // alias
router.use('/verify', verifyRoutes);
router.use('/stats', statsRoutes);

// Backwards-compatible aliases for endpoints requested by legacy pages
router.get('/birthday-members', (req, res, next) => {
  const memberController = require('../controllers/memberController');
  return memberController.getBirthdayMembers(req, res, next);
});

router.post('/analytics/view', (req, res, next) => {
  const settingController = require('../controllers/settingController');
  return settingController.incrementPageView(req, res, next);
});

router.get('/coordinators/report', (req, res, next) => {
  const { verifyToken, requireRole } = require('../middlewares/auth');
  const memberController = require('../controllers/memberController');
  verifyToken(req, res, () => {
    requireRole(['coordinator', 'admin', 'manager'])(req, res, () => {
      memberController.getCoordinatorReport(req, res, next);
    });
  });
});

router.get('/coordinators/all-stats', (req, res, next) => {
  const { verifyToken, requireRole } = require('../middlewares/auth');
  const memberController = require('../controllers/memberController');
  verifyToken(req, res, () => {
    requireRole(['admin', 'manager'])(req, res, () => {
      memberController.getAllCoordinatorsStats(req, res, next);
    });
  });
});

module.exports = router;
