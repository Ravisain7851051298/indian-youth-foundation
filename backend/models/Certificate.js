const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateNo: { type: String, required: true, unique: true },
  recipientName: { type: String, required: true },
  recipientId: { type: String, default: '' },
  recipientPhone: { type: String, default: '' },
  awardTitle: { type: String, required: true }, // e.g. "उत्कृष्ट सेवा सम्मान (Excellence in Social Service)"
  eventOrWork: { type: String, default: '' },
  issueDate: { type: String, required: true },
  description: { type: String, default: '' },
  issuedBy: { type: String, default: 'राष्ट्रीय अध्यक्ष / सचिव, भारतीय युवा क्रांति' },
  qrCodeUrl: { type: String, default: '' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Certificate', certificateSchema);
