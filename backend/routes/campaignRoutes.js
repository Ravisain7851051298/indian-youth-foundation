const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

router.get('/', campaignController.getCampaigns);
router.post('/', verifyToken, requireRole(['admin', 'Admin']), handleOptionalFileUpload, campaignController.createCampaign);
router.put('/:id', verifyToken, requireRole(['admin', 'Admin']), handleOptionalFileUpload, campaignController.updateCampaign);
router.delete('/:id', verifyToken, requireRole(['admin', 'Admin']), campaignController.deleteCampaign);

module.exports = router;
