const express = require('express');
const router = express.Router();
const orgDocumentController = require('../controllers/orgDocumentController');
const { verifyToken, optionalAuth, requireRole } = require('../middlewares/auth');

// Public & Authenticated Read
router.get('/', optionalAuth, orgDocumentController.getAllOrgDocuments);
router.get('/all', optionalAuth, orgDocumentController.getAllOrgDocuments);

// Admin-Only Mutation Routes
router.post('/', verifyToken, requireRole(['Admin', 'admin', 'manager']), orgDocumentController.createOrgDocument);
router.post('/create', verifyToken, requireRole(['Admin', 'admin', 'manager']), orgDocumentController.createOrgDocument);
router.put('/:id', verifyToken, requireRole(['Admin', 'admin', 'manager']), orgDocumentController.updateOrgDocument);
router.delete('/:id', verifyToken, requireRole(['Admin', 'admin', 'manager']), orgDocumentController.deleteOrgDocument);

module.exports = router;
