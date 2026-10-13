const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fee: { type: Number, required: true },
  duration: { type: String, default: '1 Year' },
  description: { type: String, default: '' },
  perks: [{ type: String }],
  popular: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
