const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, unique: true, sparse: true },
  certificateNo: { type: String, unique: true, sparse: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  recipientName: { type: String, required: true },
  recipientId: { type: String, default: '' },
  recipientEmail: { type: String, default: '' },
  recipientPhone: { type: String, default: '' },
  title: { type: String, default: 'Certificate of Appreciation & National Service' },
  titleHi: { type: String, default: 'प्रशंसा एवं राष्ट्र सेवा प्रमाण पत्र' },
  awardTitle: { type: String, default: '' },
  reason: { type: String, default: '' },
  reasonHi: { type: String, default: '' },
  description: { type: String, default: '' },
  roleOrDesignation: { type: String, default: 'Youth Contributor' },
  eventOrWork: { type: String, default: '' },
  issueDate: { type: Date, default: Date.now },
  issuedBy: { type: String, default: 'राष्ट्रीय अध्यक्ष / सचिव, युवा क्रांति दल' },
  qrCodeUrl: { type: String, default: '' },
  fileUrl: { type: String, default: '' },
  pdfUrl: { type: String, default: '' },
  verified: { type: Boolean, default: true }
}, {
  timestamps: true
});

// Pre-save hook to synchronize certificateId & certificateNo and title & awardTitle
certificateSchema.pre('save', function () {
  if (this.certificateId && !this.certificateNo) {
    this.certificateNo = this.certificateId;
  } else if (this.certificateNo && !this.certificateId) {
    this.certificateId = this.certificateNo;
  }

  if (this.title && !this.awardTitle) {
    this.awardTitle = this.title;
  } else if (this.awardTitle && !this.title) {
    this.title = this.awardTitle;
  }

  if (this.reason && !this.description) {
    this.description = this.reason;
  } else if (this.description && !this.reason) {
    this.reason = this.description;
  }
});

certificateSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('Certificate', certificateSchema);
