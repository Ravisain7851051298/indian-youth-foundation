const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

router.get('/', newsController.getNews);
router.post('/', verifyToken, requireRole(['admin', 'manager']), handleOptionalFileUpload, newsController.createNews);
router.put('/:id', verifyToken, requireRole(['admin', 'manager']), handleOptionalFileUpload, newsController.updateNews);
router.delete('/:id', verifyToken, requireRole(['admin']), newsController.deleteNews);

module.exports = router;
