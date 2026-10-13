const auditService = require('../services/auditService');

const getAuditReports = async (req, res) => {
  try {
    const reports = await auditService.getAuditReports();
    return res.json({ success: true, reports, total: reports.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createAuditReport = async (req, res) => {
  try {
    const report = await auditService.createAuditReport(req.body);
    return res.status(201).json({
      success: true,
      message: 'Financial audit report uploaded successfully',
      report
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteAuditReport = async (req, res) => {
  try {
    const { id } = req.params;
    await auditService.deleteAuditReport(id);
    return res.json({
      success: true,
      message: 'Audit report deleted successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAuditReports,
  createAuditReport,
  deleteAuditReport
};
