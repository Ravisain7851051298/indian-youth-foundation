const express = require('express');
const router = express.Router();
const awardController = require('../controllers/awardController');
const { verifyToken, requireRole } = require('../middlewares/auth');

// Public & user-specific
router.get('/my-awards', verifyToken, awardController.getMyAwards);
router.get('/user/:userId', awardController.getUserAwardsByUserId);

// Award definitions / templates
router.get('/', awardController.getAwards);
router.post('/', verifyToken, requireRole(['admin', 'manager']), awardController.createAward);
router.put('/:id', verifyToken, requireRole(['admin', 'manager']), awardController.updateAward);
router.delete('/:id', verifyToken, requireRole(['admin']), awardController.deleteAward);

// Award grants (offering awards to users/volunteers/members)
router.get('/grants', verifyToken, requireRole(['admin', 'manager', 'coordinator']), awardController.getAllGrantedAwards);
router.post('/grant', verifyToken, requireRole(['admin', 'manager']), awardController.grantAwardToUser);
router.delete('/grant/:id', verifyToken, requireRole(['admin']), awardController.revokeUserAward);

module.exports = router;
