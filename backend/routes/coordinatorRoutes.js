const express = require('express');
const router = express.Router();
const coordinatorController = require('../controllers/coordinatorController');
const { verifyToken, requireRole, requireAdmin } = require('../middlewares/auth');

// Coordinator personal hub & member addition routes
router.get('/my-stats', verifyToken, requireRole(['Coordinator', 'coordinator', 'Admin', 'admin']), coordinatorController.getMyStats);
router.get('/my-members', verifyToken, requireRole(['Coordinator', 'coordinator', 'Admin', 'admin']), coordinatorController.getMyMembers);
router.post('/add-member', verifyToken, requireRole(['Coordinator', 'coordinator', 'Admin', 'admin']), coordinatorController.addMemberByCoordinator);

// Trustee Administrator routes
router.post('/create', verifyToken, requireAdmin, coordinatorController.createCoordinator);
router.post('/promote/:userId', verifyToken, requireAdmin, coordinatorController.promoteUserToCoordinator);
router.post('/promote', verifyToken, requireAdmin, coordinatorController.promoteUserToCoordinator);
router.post('/:userId/promote', verifyToken, requireAdmin, coordinatorController.promoteUserToCoordinator);
router.post('/:userId/make-coordinator', verifyToken, requireAdmin, coordinatorController.promoteUserToCoordinator);
router.get('/', verifyToken, requireAdmin, coordinatorController.getAllCoordinators);
router.get('/:id/members', verifyToken, requireAdmin, coordinatorController.getCoordinatorMembers);
router.post('/:id/resend-credentials', verifyToken, requireAdmin, coordinatorController.resendCredentials);

module.exports = router;
