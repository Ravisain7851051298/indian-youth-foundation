const auditRepository = require('../repositories/auditRepository');

class AuditService {
  async getAuditReports(query = {}) {
    return auditRepository.find(query);
  }

  async createAuditReport(data) {
    if (!data.title || !data.financialYear || !data.fileUrl) {
      throw new Error('Title, financial year, and file URL are required');
    }
    return auditRepository.create(data);
  }

  async deleteAuditReport(id) {
    const report = await auditRepository.deleteById(id);
    if (!report) throw new Error('Audit report not found');
    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(report);
    return report;
  }
}

module.exports = new AuditService();
