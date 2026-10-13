const emailLogService = require('../services/emailLogService');

const getEmailLogs = async (req, res) => {
  try {
    const logs = await emailLogService.getEmailLogs();
    return res.json({ success: true, logs, total: logs.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEmailLogs
};
