const settingService = require('../services/settingService');

// Security: Format settings for client consumption
const formatSettingsForAdmin = (settings) => {
  if (!settings) return null;
  const obj = settings.toObject ? settings.toObject() : { ...settings };
  obj.smtpHost = obj.smtpHost || 'smtp.gmail.com';
  obj.smtpPort = obj.smtpPort || 587;
  obj.smtpUser = obj.smtpUser || 'ravisain75688@gmail.com';
  obj.smtpPass = obj.smtpPass || 'wmthwfbokhovuugu';
  obj.smtpFromName = obj.smtpFromName || obj.ngoName || 'Yuva Kranti Dal';
  obj.adminSecretKey = obj.adminSecretKey || 'ravi123';
  obj.ngoName = obj.ngoName || 'Yuva Kranti Dal';
  obj.ngoNameHi = obj.ngoNameHi || 'युवा क्रांति दल';
  obj.hasSmtpConfigured = Boolean(obj.smtpPass);
  return obj;
};

const sanitizeSettingsForPublic = (settings) => {
  if (!settings) return null;
  const obj = settings.toObject ? settings.toObject() : { ...settings };
  obj.smtpHost = obj.smtpHost || 'smtp.gmail.com';
  obj.smtpPort = obj.smtpPort || 587;
  obj.smtpUser = obj.smtpUser || 'ravisain75688@gmail.com';
  obj.smtpFromName = obj.smtpFromName || obj.ngoName || 'Yuva Kranti Dal';
  obj.ngoName = obj.ngoName || 'Yuva Kranti Dal';
  obj.ngoNameHi = obj.ngoNameHi || 'युवा क्रांति दल';
  obj.hasSmtpConfigured = Boolean(obj.smtpPass);
  delete obj.smtpPass;
  delete obj.adminSecretKey;
  return obj;
};

const getSettings = async (req, res) => {
  try {
    const settings = await settingService.getSettings();
    const isAdmin = (req.user?.role || '').toLowerCase() === 'admin' || req.isAdminSecret;
    const result = isAdmin ? formatSettingsForAdmin(settings) : sanitizeSettingsForPublic(settings);
    return res.json({ success: true, settings: result });
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
    } else {
      updateData.smtpPass = updateData.smtpPass.replace(/\s+/g, '').trim();
    }

    // Prevent overwriting adminSecretKey with empty string or masked bullets
    if (!updateData.adminSecretKey || updateData.adminSecretKey.trim() === '' || updateData.adminSecretKey.includes('•') || updateData.adminSecretKey.includes('*')) {
      delete updateData.adminSecretKey;
    }

    const settings = await settingService.updateSettings(updateData);
    // Since this endpoint requires Admin authorization, return full updated settings so form is never wiped
    return res.json({
      success: true,
      message: 'Settings updated successfully',
      settings: formatSettingsForAdmin(settings)
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
    const host = (smtpHost || currentSettings.smtpHost || process.env.SMTP_HOST || 'smtp.gmail.com').trim();
    const port = Number(smtpPort || currentSettings.smtpPort || process.env.SMTP_PORT || 587);
    let user = (smtpUser || currentSettings.smtpUser || process.env.SMTP_USER || '').trim();
    
    // Clean password from spaces (e.g. Google's "abcd efgh ijkl mnop" format)
    let pass = (smtpPass || '').replace(/\s+/g, '').trim();

    // If pass is omitted or masked bullets, check if currentSettings has a real non-bullet password
    if ((!pass || pass.includes('•') || pass.includes('*')) && currentSettings.smtpPass && !currentSettings.smtpPass.includes('•')) {
      pass = currentSettings.smtpPass.replace(/\s+/g, '').trim();
    }
    // If still blank or bullet, fallback to process.env.SMTP_PASS
    if ((!pass || pass.includes('•') || pass.includes('*')) && process.env.SMTP_PASS && !process.env.SMTP_PASS.includes('•')) {
      pass = process.env.SMTP_PASS.replace(/\s+/g, '').trim();
    }

    const fromName = (smtpFromName || currentSettings.smtpFromName || currentSettings.ngoName || process.env.SMTP_FROM_NAME || 'Yuva Kranti Dal').trim();
    const to = (testReceiverEmail || '').trim();

    if (!user) {
      return res.status(400).json({ success: false, message: 'SMTP Username/Email is required. Please configure it in Settings or set SMTP_USER in the root .env file.' });
    }
    if (!pass || pass.includes('•') || pass.includes('*')) {
      return res.status(400).json({ 
        success: false, 
        message: 'SMTP App Password is required. Please enter your 16-character Google App Password in the SMTP Password field or set SMTP_PASS in the root .env file.' 
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

    // Automatically persist the tested working credentials if requested and a real password was provided
    if (saveAfterSuccess !== false && smtpPass && !smtpPass.includes('•')) {
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
