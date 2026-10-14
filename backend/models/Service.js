const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, default: 'Social Welfare & Community', trim: true },
  description: { type: String, required: true, trim: true },
  features: { type: [String], default: [] },
  icon: { type: String, default: 'FiActivity', trim: true },
  image: { type: String, default: '', trim: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  timestamps: true
});

serviceSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('Service', serviceSchema);
