const mongoose = require('mongoose');

const membershipPlanSchema = new mongoose.Schema({
  title: { type: String, default: '' },
  name: { type: String, default: '' },
  price: { type: Number, default: 0 },
  fee: { type: Number, default: 0 },
  duration: { type: String, default: '1 Year' },
  validityMonths: { type: Number, default: 12 },
  description: { type: String, default: '' },
  titleHi: { type: String, default: '' },
  perks: [{ type: String }],
  benefits: [{ type: String }],
  benefitsHi: [{ type: String }],
  popular: { type: Boolean, default: false },
  isPopular: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, {
  timestamps: true
});

membershipPlanSchema.pre('validate', function () {
  if (this.title && !this.name) this.name = this.title;
  if (this.name && !this.title) this.title = this.name;
  if (this.price !== undefined && !this.fee) this.fee = this.price;
  if (this.fee !== undefined && !this.price) this.price = this.fee;
  if (this.benefits?.length && (!this.perks || this.perks.length === 0)) this.perks = this.benefits;
  if (this.perks?.length && (!this.benefits || this.benefits.length === 0)) this.benefits = this.perks;
  if (this.isPopular !== undefined) this.popular = this.isPopular;
  if (this.popular !== undefined) this.isPopular = this.popular;
});

module.exports = mongoose.model('MembershipPlan', membershipPlanSchema);
