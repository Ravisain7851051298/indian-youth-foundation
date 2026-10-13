const Setting = require('../models/Setting');

class SettingRepository {
  async getSettings() {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        ngoName: process.env.NGO_NAME || 'भारतीय युवा क्रांति (Indian Youth Foundation)',
        tagline: 'सशक्त युवा, समर्थ भारत',
        registrationNumber: 'IV-4521/2020',
        section80GNumber: 'CIT(E)/DELHI/80G/2021-22/A/10452',
        section12ANumber: 'CIT(E)/DELHI/12A/2020-21/A/9874',
        panNumber: 'AAATB1234F',
        tanNumber: 'DELT09876E',
        email: 'samasyasamadhanparishad@gmail.com',
        phone: '+91 93196 98759',
        address: 'Head Office - Krishna Vihar Pala Road Aligarh, Uttar Pradesh - 202001',
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: parseInt(process.env.SMTP_PORT || '587', 10),
        smtpUser: process.env.SMTP_USER || 'samasyasamadhanparishad@gmail.com',
        smtpPass: process.env.SMTP_PASS || '',
        adminSecretKey: process.env.X_ADMIN_SECRET_KEY || 'BYK_SUPER_ADMIN_ALIGARH_SECRET_2026'
      });
    }
    return settings;
  }

  async updateSettings(updateData) {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(updateData);
    } else {
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
