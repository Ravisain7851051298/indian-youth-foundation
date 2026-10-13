const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/', newsController.getNews);
router.post('/', verifyToken, requireRole(['admin', 'manager']), newsController.createNews);
router.put('/:id', verifyToken, requireRole(['admin', 'manager']), newsController.updateNews);
router.delete('/:id', verifyToken, requireRole(['admin']), newsController.deleteNews);

module.exports = router;
