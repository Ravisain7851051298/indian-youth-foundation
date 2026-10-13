const settingService = require('../services/settingService');

const getSettings = async (req, res) => {
  try {
    const settings = await settingService.getSettings();
    return res.json({ success: true, settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = await settingService.updateSettings(req.body);
    return res.json({
      success: true,
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const incrementPageView = async (req, res) => {
  try {
    const views = await settingService.incrementPageView();
    return res.json({ success: true, views });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  incrementPageView
};
