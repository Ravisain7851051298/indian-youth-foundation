const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/', eventController.getEvents);
router.post('/', verifyToken, requireRole(['admin', 'manager']), eventController.createEvent);
router.put('/:id', verifyToken, requireRole(['admin', 'manager']), eventController.updateEvent);
router.delete('/:id', verifyToken, requireRole(['admin']), eventController.deleteEvent);

module.exports = router;
