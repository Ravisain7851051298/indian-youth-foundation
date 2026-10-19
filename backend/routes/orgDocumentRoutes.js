const express = require('express');
const router = express.Router();
const orgDocumentController = require('../controllers/orgDocumentController');
const { verifyToken, optionalAuth, requireRole } = require('../middlewares/auth');

// Public & Authenticated Read
router.get('/', optionalAuth, orgDocumentController.getAllOrgDocuments);
router.get('/all', optionalAuth, orgDocumentController.getAllOrgDocuments);

// Admin-Only Mutation Routes
router.post('/', verifyToken, requireRole(['admin']), orgDocumentController.createOrgDocument);
router.post('/create', verifyToken, requireRole(['admin']), orgDocumentController.createOrgDocument);
router.put('/:id', verifyToken, requireRole(['admin']), orgDocumentController.updateOrgDocument);
router.delete('/:id', verifyToken, requireRole(['admin']), orgDocumentController.deleteOrgDocument);

module.exports = router;
