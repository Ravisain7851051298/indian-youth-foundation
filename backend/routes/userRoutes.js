const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/stats', verifyToken, requireRole(['admin', 'manager']), userController.getUserStats);
router.get('/', verifyToken, requireRole(['admin', 'manager']), userController.getUsers);
router.get('/:id', verifyToken, requireRole(['admin', 'manager']), userController.getUserById);
router.put('/:id/status', verifyToken, requireRole(['admin']), userController.updateUserStatus);
router.delete('/:id', verifyToken, requireRole(['admin']), userController.deleteUser);

module.exports = router;
