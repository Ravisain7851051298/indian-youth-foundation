const express = require('express');
const router = express.Router();
const awardController = require('../controllers/awardController');
const { verifyToken, requireRole } = require('../middlewares/auth');

// Public & user-specific
router.get('/my-awards', verifyToken, awardController.getMyAwards);
router.get('/user/:userId', awardController.getUserAwardsByUserId);

// Award definitions / templates
router.get('/', awardController.getAwards);
router.post('/', verifyToken, requireRole(['admin']), awardController.createAward);
router.put('/:id', verifyToken, requireRole(['admin']), awardController.updateAward);
router.delete('/:id', verifyToken, requireRole(['admin']), awardController.deleteAward);

// Award grants (offering awards to users/volunteers/members)
router.get('/grants', verifyToken, requireRole(['admin']), awardController.getAllGrantedAwards);
router.post('/grant', verifyToken, requireRole(['admin']), awardController.grantAwardToUser);
router.delete('/grant/:id', verifyToken, requireRole(['admin']), awardController.revokeUserAward);

module.exports = router;
