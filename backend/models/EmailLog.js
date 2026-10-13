const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  template: { type: String, default: 'general' },
  status: { type: String, default: 'delivered' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  sentAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
