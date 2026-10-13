const mongoose = require('mongoose');

const membershipApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  planId: { type: String, required: true },
  planName: { type: String, required: true },
  feeAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'UPI' },
  transactionId: { type: String, default: '' },
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
  rejectionReason: { type: String, default: null }
}, {
  timestamps: true
});

module.exports = mongoose.model('MembershipApplication', membershipApplicationSchema);
