const settingService = require('../services/settingService');

// Security: Strip internal/sensitive credentials from API responses
const sanitizeSettings = (settings) => {
  if (!settings) return null;
  const obj = settings.toObject ? settings.toObject() : { ...settings };
  delete obj.smtpHost;
  delete obj.smtpPort;
  delete obj.smtpUser;
  delete obj.smtpPass;
  delete obj.adminSecretKey;
  return obj;
};

const getSettings = async (req, res) => {
  try {
    const settings = await settingService.getSettings();
    return res.json({ success: true, settings: sanitizeSettings(settings) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Prevent overwriting real SMTP password with empty string or masked bullets
    if (!updateData.smtpPass || updateData.smtpPass.trim() === '' || updateData.smtpPass.includes('•') || updateData.smtpPass.includes('*')) {
      delete updateData.smtpPass;
    }
    // Prevent overwriting adminSecretKey with empty string or masked bullets
    if (!updateData.adminSecretKey || updateData.adminSecretKey.trim() === '' || updateData.adminSecretKey.includes('•') || updateData.adminSecretKey.includes('*')) {
      delete updateData.adminSecretKey;
    }
    // Prevent clearing existing SMTP host/port/user if omitted
    if (!updateData.smtpUser || updateData.smtpUser.trim() === '') {
      delete updateData.smtpUser;
    }
    if (!updateData.smtpHost || updateData.smtpHost.trim() === '') {
      delete updateData.smtpHost;
    }
    if (!updateData.smtpPort) {
      delete updateData.smtpPort;
    }

    const settings = await settingService.updateSettings(updateData);
    return res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: sanitizeSettings(settings)
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

const testEmailConnection = async (req, res) => {
  try {
    const { smtpHost, smtpPort, smtpUser, smtpPass, smtpFromName, testReceiverEmail, saveAfterSuccess } = req.body;
    const emailService = require('../services/emailService');
    const settingRepository = require('../repositories/settingRepository');

    // Retrieve active settings as base
    const currentSettings = await settingRepository.getSettings() || {};
    const host = (smtpHost || currentSettings.smtpHost || 'smtp.gmail.com').trim();
    const port = Number(smtpPort || currentSettings.smtpPort || 587);
    const user = (smtpUser || currentSettings.smtpUser || '').trim();
    
    // Clean password from spaces (e.g. Google's "abcd efgh ijkl mnop" format)
    let pass = (smtpPass || '').replace(/\s+/g, '').trim();

    // If pass is omitted or masked bullets, check if currentSettings has a real non-bullet password
    if ((!pass || pass.includes('•') || pass.includes('*')) && currentSettings.smtpPass && !currentSettings.smtpPass.includes('•')) {
      pass = currentSettings.smtpPass.replace(/\s+/g, '').trim();
    }

    const fromName = (smtpFromName || currentSettings.smtpFromName || currentSettings.ngoName || 'Indian Youth Foundation').trim();
    const to = (testReceiverEmail || '').trim();

    if (!user) {
      return res.status(400).json({ success: false, message: 'SMTP Username/Email is required.' });
    }
    if (!pass || pass.includes('•') || pass.includes('*')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter your actual 16-character Google App Password in the SMTP Password field (masked bullet characters •••••••• cannot be authenticated).' 
      });
    }
    if (!to) {
      return res.status(400).json({ success: false, message: 'Recipient test email address is required.' });
    }

    const result = await emailService.testSmtpConnection({
      host,
      port,
      user,
      pass,
      fromName,
      to
    });

    // Automatically persist the tested working credentials if requested
    if (saveAfterSuccess !== false) {
      await settingRepository.updateSettings({
        smtpHost: host,
        smtpPort: port,
        smtpUser: user,
        smtpPass: pass,
        smtpFromName: fromName
      });
    }

    return res.json({
      success: true,
      message: `Diagnostic test email successfully dispatched to ${to}! Credentials verified and active.`,
      result
    });
  } catch (error) {
    console.error('SMTP Diagnostic Test Error:', error.message);
    let friendlyMessage = error.message;
    if (friendlyMessage.includes('535') || friendlyMessage.includes('BadCredentials') || friendlyMessage.includes('Username and Password not accepted')) {
      friendlyMessage = 'Google SMTP authentication failed (535 Bad Credentials). Please ensure 2-Step Verification is ON in your Google Account and generate a new 16-character "App Password" (without spaces) from: https://myaccount.google.com/apppasswords';
    } else if (friendlyMessage.includes('ETIMEDOUT') || friendlyMessage.includes('ESOCKETTIMEDOUT')) {
      friendlyMessage = 'SMTP connection timed out. Please check your SMTP Host (smtp.gmail.com) and Port (587 or 465).';
    }
    return res.status(400).json({
      success: false,
      message: friendlyMessage
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  incrementPageView,
  testEmailConnection
};
