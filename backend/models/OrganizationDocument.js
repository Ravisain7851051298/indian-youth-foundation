const mongoose = require('mongoose');

const organizationDocumentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  titleHi: { type: String, default: '', trim: true },
  category: { 
    type: String, 
    enum: [
      '12A Registration', 
      '80G Exemption', 
      'NITI Aayog Darpan', 
      'Trust Registration', 
      'CSR-1 Filing', 
      'PAN Card', 
      'Statutory / Legal', 
      'Audit Report', 
      'Other'
    ],
    default: 'Statutory / Legal'
  },
  documentNumber: { type: String, default: '', trim: true },
  issuingAuthority: { type: String, default: '', trim: true },
  issueDate: { type: Date, default: Date.now },
  validity: { type: String, default: 'Perpetual / Ongoing', trim: true },
  fileUrl: { type: String, required: true, trim: true },
  fileType: { type: String, enum: ['pdf', 'image'], default: 'pdf' },
  fileSize: { type: String, default: '' },
  description: { type: String, default: '', trim: true },
  status: { type: String, enum: ['Verified', 'Pending', 'Archived'], default: 'Verified' },
  order: { type: Number, default: 0 }
}, {
  timestamps: true
});

organizationDocumentSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('OrganizationDocument', organizationDocumentSchema);
