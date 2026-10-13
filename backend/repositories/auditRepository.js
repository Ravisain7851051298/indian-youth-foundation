const AuditReport = require('../models/AuditReport');

class AuditRepository {
  async create(data) {
    const report = new AuditReport(data);
    return report.save();
  }

  async findById(id) {
    return AuditReport.findById(id);
  }

  async find(query = {}, sort = { createdAt: -1 }) {
    return AuditReport.find(query).sort(sort);
  }

  async deleteById(id) {
    return AuditReport.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return AuditReport.countDocuments(query);
  }
}

module.exports = new AuditRepository();
