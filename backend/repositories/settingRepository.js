const Setting = require('../models/Setting');

class SettingRepository {
  async getSettings() {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        ngoName: 'Yuva Kranti Dal',
        ngoNameHi: 'युवा क्रांति दल',
        tagline: 'सशक्त युवा, समर्थ भारत',
        registrationNumber: 'IV-4521/2020',
        section80GNumber: 'CIT(E)/DELHI/80G/2021-22/A/10452',
        section12ANumber: 'CIT(E)/DELHI/12A/2020-21/A/9874',
        panNumber: 'AAATB1234F',
        tanNumber: 'DELT09876E',
        email: 'ravisain75688@gmail.com',
        phone: '+91 93196 98759',
        address: 'Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001',
        smtpHost: 'smtp.gmail.com',
        smtpPort: 587,
        smtpUser: 'ravisain75688@gmail.com',
        smtpPass: 'wmthwfbokhovuugu',
        smtpFromName: 'Yuva Kranti Dal',
        adminSecretKey: 'ravi123'
      });
    } else {
      let needsSave = false;
      if (!settings.smtpUser) {
        settings.smtpUser = 'ravisain75688@gmail.com';
        needsSave = true;
      }
      if (!settings.smtpPass) {
        settings.smtpPass = 'wmthwfbokhovuugu';
        needsSave = true;
      }
      if (!settings.smtpHost) {
        settings.smtpHost = 'smtp.gmail.com';
        needsSave = true;
      }
      if (!settings.smtpFromName) {
        settings.smtpFromName = settings.ngoName || 'Yuva Kranti Dal';
        needsSave = true;
      }
      if (needsSave) {
        await settings.save();
      }
    }
    return settings;
  }

  async updateSettings(updateData) {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(updateData);
    } else {
      // Clean smtpPass if provided
      if (updateData.smtpPass && typeof updateData.smtpPass === 'string') {
        const clean = updateData.smtpPass.replace(/\s+/g, '').trim();
        if (clean && !clean.includes('•') && !clean.includes('*')) {
          updateData.smtpPass = clean;
        } else {
          delete updateData.smtpPass;
        }
      }

      // Preserve existing bankDetails when updating nested properties
      if (updateData.bankDetails) {
        settings.bankDetails = {
          accountName: updateData.bankDetails.accountName || settings.bankDetails?.accountName || '',
          accountNumber: updateData.bankDetails.accountNumber || settings.bankDetails?.accountNumber || '',
          ifscCode: updateData.bankDetails.ifscCode || settings.bankDetails?.ifscCode || '',
          bankName: updateData.bankDetails.bankName || settings.bankDetails?.bankName || '',
          branch: updateData.bankDetails.branch || settings.bankDetails?.branch || ''
        };
        delete updateData.bankDetails;
      }

      Object.assign(settings, updateData);
      await settings.save();
    }
    return settings;
  }

  async incrementPageView() {
    const settings = await this.getSettings();
    settings.pageViews = (settings.pageViews || 0) + 1;
    await settings.save();
    return settings.pageViews;
  }
}

module.exports = new SettingRepository();
