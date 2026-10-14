const mongoose = require('mongoose');
const fileCleanupPlugin = require('./plugins/fileCleanupPlugin');

const membershipApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan' },
  planId: { type: String, default: '' },
  planName: { type: String, default: '' },
  feeAmount: { type: Number, default: 0 },
  amount: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'UPI' },
  transactionId: { type: String, default: '' },
  utrNumber: { type: String, default: '' },
  paymentScreenshot: { type: String, default: '' },
  notes: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  assignedMemberId: { type: String, default: null },
  verifiedAt: { type: Date, default: null },
  verifiedBy: { type: String, default: null },
  reviewedAt: { type: Date, default: null },
  reviewedBy: { type: String, default: null },
  rejectionReason: { type: String, default: null }
}, {
  timestamps: true
});

membershipApplicationSchema.pre('save', function () {
  if (this.user && !this.userId) this.userId = this.user;
  if (this.userId && !this.user) this.user = this.userId;
  if (this.feeAmount && !this.amount) this.amount = this.feeAmount;
  if (this.amount && !this.feeAmount) this.feeAmount = this.amount;
  if (this.transactionId && !this.utrNumber) this.utrNumber = this.transactionId;
  if (this.utrNumber && !this.transactionId) this.transactionId = this.utrNumber;
});

membershipApplicationSchema.plugin(fileCleanupPlugin);

module.exports = mongoose.model('MembershipApplication', membershipApplicationSchema);
