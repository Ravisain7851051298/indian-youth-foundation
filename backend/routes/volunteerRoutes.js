const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken } = require('../middlewares/auth');

router.post('/apply', verifyToken, applicationController.applyVolunteer);

module.exports = router;
