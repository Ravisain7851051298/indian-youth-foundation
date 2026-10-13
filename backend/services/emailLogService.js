const emailLogRepository = require('../repositories/emailLogRepository');

class EmailLogService {
  async getEmailLogs(query = {}) {
    return emailLogRepository.find(query);
  }
}

module.exports = new EmailLogService();
