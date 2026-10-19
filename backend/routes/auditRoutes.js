const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/', auditController.getAuditReports);
router.post('/', verifyToken, requireRole(['admin', 'Admin']), auditController.createAuditReport);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), auditController.deleteAuditReport);

module.exports = router;
