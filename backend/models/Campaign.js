const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleHi: { type: String, required: true },
  description: { type: String, required: true },
  descriptionHi: { type: String, required: true },
  category: { type: String, default: 'Education & Youth' },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  bannerImage: { type: String, default: '' },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  endDate: { type: String, default: '' },
  urgent: { type: Boolean, default: false },
  donorCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Campaign', campaignSchema);
