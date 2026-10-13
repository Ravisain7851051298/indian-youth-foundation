const settingRepository = require('../repositories/settingRepository');

class SettingService {
  async getSettings() {
    return settingRepository.getSettings();
  }

  async updateSettings(updateData) {
    return settingRepository.updateSettings(updateData);
  }

  async incrementPageView() {
    return settingRepository.incrementPageView();
  }
}

module.exports = new SettingService();
