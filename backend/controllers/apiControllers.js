// Backwards compatibility aggregator module
// All business logic, repositories, and controllers are cleanly separated in individual files

const authController = require('./authController');
const applicationController = require('./applicationController');
const donationController = require('./donationController');
const planController = require('./planController');
const memberController = require('./memberController');
const certificateController = require('./certificateController');
const campaignController = require('./campaignController');
const eventController = require('./eventController');
const newsController = require('./newsController');
const galleryController = require('./galleryController');
const grievanceController = require('./grievanceController');
const auditController = require('./auditController');
const settingController = require('./settingController');
const emailLogController = require('./emailLogController');
const uploadController = require('./uploadController');

module.exports = {
  ...authController,
  ...applicationController,
  ...donationController,
  ...planController,
  ...memberController,
  ...certificateController,
  ...campaignController,
  ...eventController,
  ...newsController,
  ...galleryController,
  ...grievanceController,
  ...auditController,
  ...settingController,
  ...emailLogController,
  ...uploadController
};
