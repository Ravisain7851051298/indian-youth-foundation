const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');
const { verifyToken, requireRole } = require('../middlewares/auth');

router.get('/', campaignController.getCampaigns);
router.post('/', verifyToken, requireRole(['admin']), campaignController.createCampaign);
router.put('/:id', verifyToken, requireRole(['admin']), campaignController.updateCampaign);
router.delete('/:id', verifyToken, requireRole(['admin']), campaignController.deleteCampaign);

module.exports = router;
