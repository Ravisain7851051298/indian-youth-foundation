const express = require('express');
const contentController = require('../controllers/contentController');
const { verifyToken, requireRole } = require('../middlewares/auth');

function createResourceRouter(resourceName) {
  const router = express.Router();

  // Public GET endpoints
  router.get('/', contentController.getAll(resourceName));
  router.get('/all', contentController.getAll(resourceName));
  router.get('/admin/all', verifyToken, requireRole(['admin', 'manager']), contentController.getAll(resourceName));
  router.get('/:id', contentController.getById(resourceName));

  // Admin mutation endpoints
  router.post('/', verifyToken, requireRole(['admin', 'manager']), contentController.createItem(resourceName));
  router.post('/admin', verifyToken, requireRole(['admin', 'manager']), contentController.createItem(resourceName));
  router.put('/:id', verifyToken, requireRole(['admin', 'manager']), contentController.updateItem(resourceName));
  router.put('/admin/:id', verifyToken, requireRole(['admin', 'manager']), contentController.updateItem(resourceName));
  router.delete('/:id', verifyToken, requireRole(['admin']), contentController.deleteItem(resourceName));
  router.delete('/admin/:id', verifyToken, requireRole(['admin']), contentController.deleteItem(resourceName));

  return router;
}

module.exports = createResourceRouter;
