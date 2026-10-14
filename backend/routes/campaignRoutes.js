const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { verifyToken, requireRole } = require('../middlewares/auth');
const { handleOptionalFileUpload } = require('../middlewares/upload');

router.get('/', campaignController.getCampaigns);
router.post('/', verifyToken, requireRole(['admin']), handleOptionalFileUpload, campaignController.createCampaign);
router.put('/:id', verifyToken, requireRole(['admin']), handleOptionalFileUpload, campaignController.updateCampaign);
router.delete('/:id', verifyToken, requireRole(['admin']), campaignController.deleteCampaign);

module.exports = router;
