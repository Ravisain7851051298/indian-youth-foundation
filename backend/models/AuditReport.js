const mongoose = require('mongoose');

const auditReportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  financialYear: { type: String, required: true },
  fileUrl: { type: String, required: true },
  caName: { type: String, default: '' },
  uploadDate: { type: Date, default: Date.now },
  remarks: { type: String, default: '' }
}, {
  timestamps: true
});

auditReportSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('AuditReport', auditReportSchema);
