const express = require('express');
const router = express.Router();
const coordinatorController = require('../controllers/coordinatorController');
const { verifyToken, requireRole, requireAdmin } = require('../middlewares/auth');

// Coordinator personal hub & member addition routes
router.get('/my-stats', verifyToken, requireRole(['Coordinator', 'coordinator', 'Admin', 'admin']), coordinatorController.getMyStats);
router.get('/stats', verifyToken, requireRole(['Coordinator', 'coordinator', 'Admin', 'admin']), coordinatorController.getMyStats);
router.get('/my-members', verifyToken, requireRole(['Coordinator', 'coordinator', 'Admin', 'admin']), coordinatorController.getMyMembers);
router.get('/members', verifyToken, requireRole(['Coordinator', 'coordinator', 'Admin', 'admin']), coordinatorController.getMyMembers);
router.post('/add-member', verifyToken, requireRole(['Coordinator', 'coordinator', 'Admin', 'admin']), coordinatorController.addMemberByCoordinator);
router.put('/members/:id', verifyToken, requireRole(['Coordinator', 'coordinator', 'Admin', 'admin']), coordinatorController.updateMemberByCoordinator);
router.put('/my-members/:id', verifyToken, requireRole(['Coordinator', 'coordinator', 'Admin', 'admin']), coordinatorController.updateMemberByCoordinator);
router.delete('/members/:id', verifyToken, requireRole(['Coordinator', 'coordinator', 'Admin', 'admin']), coordinatorController.deleteMemberByCoordinator);
router.delete('/my-members/:id', verifyToken, requireRole(['Coordinator', 'coordinator', 'Admin', 'admin']), coordinatorController.deleteMemberByCoordinator);

// Trustee Administrator routes
router.post('/create', verifyToken, requireAdmin, coordinatorController.createCoordinator);
router.post('/promote/:userId', verifyToken, requireAdmin, coordinatorController.promoteUserToCoordinator);
router.post('/promote', verifyToken, requireAdmin, coordinatorController.promoteUserToCoordinator);
router.post('/:userId/promote', verifyToken, requireAdmin, coordinatorController.promoteUserToCoordinator);
router.post('/:userId/make-coordinator', verifyToken, requireAdmin, coordinatorController.promoteUserToCoordinator);
router.get('/', verifyToken, requireAdmin, coordinatorController.getAllCoordinators);
router.get('/:id/members', verifyToken, requireAdmin, coordinatorController.getCoordinatorMembers);
router.post('/:id/resend-credentials', verifyToken, requireAdmin, coordinatorController.resendCredentials);
router.post('/resend-credentials/:id', verifyToken, requireAdmin, coordinatorController.resendCredentials);
router.post('/resend-credentials', verifyToken, requireAdmin, coordinatorController.resendCredentials);
router.put('/:id', verifyToken, requireAdmin, coordinatorController.updateCoordinator);
router.delete('/:id', verifyToken, requireAdmin, coordinatorController.deleteCoordinator);

module.exports = router;
