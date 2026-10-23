const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middlewares/auth');

const coordinatorController = require('../controllers/coordinatorController');

router.get('/stats', verifyToken, requireRole(['admin', 'Admin']), userController.getUserStats);
router.get('/', verifyToken, requireRole(['admin', 'Admin']), userController.getUsers);
router.get('/:id', verifyToken, requireRole(['admin', 'Admin']), userController.getUserById);
router.put('/:id/status', verifyToken, requireRole(['admin', 'Admin']), userController.updateUserStatus);
router.post('/:id/make-coordinator', verifyToken, requireRole(['admin', 'Admin']), coordinatorController.promoteUserToCoordinator);
router.post('/:id/promote-coordinator', verifyToken, requireRole(['admin', 'Admin']), coordinatorController.promoteUserToCoordinator);
router.post('/:id/promote', verifyToken, requireRole(['admin', 'Admin']), coordinatorController.promoteUserToCoordinator);
router.post('/promote-coordinator', verifyToken, requireRole(['admin', 'Admin']), coordinatorController.promoteUserToCoordinator);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), userController.deleteUser);

module.exports = router;
