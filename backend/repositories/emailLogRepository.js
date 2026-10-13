const EmailLog = require('../models/EmailLog');

class EmailLogRepository {
  async create(data) {
    const log = new EmailLog(data);
    return log.save();
  }

  async find(query = {}, sort = { createdAt: -1 }, limit = 100) {
    return EmailLog.find(query).sort(sort).limit(limit);
  }

  async count(query = {}) {
    return EmailLog.countDocuments(query);
  }
}

module.exports = new EmailLogRepository();
