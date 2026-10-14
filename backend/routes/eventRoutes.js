const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

router.get('/', eventController.getEvents);
router.post('/', verifyToken, requireRole(['admin', 'manager']), handleOptionalFileUpload, eventController.createEvent);
router.put('/:id', verifyToken, requireRole(['admin', 'manager']), handleOptionalFileUpload, eventController.updateEvent);
router.delete('/:id', verifyToken, requireRole(['admin']), eventController.deleteEvent);

module.exports = router;
