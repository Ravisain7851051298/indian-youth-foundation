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
const feedbackRoutes = require('./feedbackRoutes');
const orgDocumentRoutes = require('./orgDocumentRoutes');
const userRoutes = require('./userRoutes');
const awardRoutes = require('./awardRoutes');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    ngo: 'युवा क्रांति दल (Yuva Kranti Dal)',
    version: '2.0.0'
  });
});

// Mount Resource Sub-routers
const createResourceRouter = require('./contentResourceRouter');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/user', userRoutes); // alias
router.use('/awards', awardRoutes);
router.use('/award', awardRoutes); // alias
router.use('/applications', applicationRoutes);
router.use('/memberships', applicationRoutes); // alias
router.use('/membership', applicationRoutes); // alias
router.use('/donations', donationRoutes);
router.use('/donation', donationRoutes); // alias
router.use('/plans', planRoutes);
router.use('/members', memberRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/volunteer', volunteerRoutes); // alias
router.use('/certificates', certificateRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/events', eventRoutes);
router.use('/event', eventRoutes); // alias
router.use('/news', newsRoutes);
router.use('/blogs', newsRoutes); // alias
router.use('/gallery', galleryRoutes);
router.use('/galleries', galleryRoutes); // alias
router.use('/grievances', grievanceRoutes);
router.use('/complaints', grievanceRoutes); // alias
router.use('/audit-reports', auditRoutes);
router.use('/settings', settingRoutes);
router.use('/email-logs', emailLogRoutes);
router.use('/uploads', uploadRoutes);
router.use('/upload', uploadRoutes); // alias
router.use('/verify', verifyRoutes);
router.use('/stats', statsRoutes);

// Additional Content Collections from shiv-gorakh-ngo
router.use('/services', createResourceRouter('services'));
router.use('/service', createResourceRouter('services'));
router.use('/programs', createResourceRouter('programs'));
router.use('/program', createResourceRouter('programs'));
router.use('/stories', createResourceRouter('stories'));
router.use('/story', createResourceRouter('stories'));
router.use('/feedback', feedbackRoutes);
router.use('/feedbacks', feedbackRoutes);
router.use('/reviews', feedbackRoutes);
router.use('/org-documents', orgDocumentRoutes);
router.use('/organization-certificates', orgDocumentRoutes);
router.use('/team-members', createResourceRouter('team-members'));
router.use('/team', createResourceRouter('team-members'));
router.use('/mission-vision', createResourceRouter('mission-vision'));


// Backwards-compatible aliases for endpoints requested by legacy pages
router.post('/analytics/view', (req, res, next) => {
  const settingController = require('../controllers/settingController');
  return settingController.incrementPageView(req, res, next);
});

router.get('/coordinators/report', (req, res, next) => {
  const { verifyToken, requireRole } = require('../middlewares/auth');
  const memberController = require('../controllers/memberController');
  verifyToken(req, res, () => {
    requireRole(['admin', 'Admin'])(req, res, () => {
      memberController.getCoordinatorReport(req, res, next);
    });
  });
});

router.get('/coordinators/all-stats', (req, res, next) => {
  const { verifyToken, requireRole } = require('../middlewares/auth');
  const memberController = require('../controllers/memberController');
  verifyToken(req, res, () => {
    requireRole(['admin', 'Admin'])(req, res, () => {
      memberController.getAllCoordinatorsStats(req, res, next);
    });
  });
});

module.exports = router;
