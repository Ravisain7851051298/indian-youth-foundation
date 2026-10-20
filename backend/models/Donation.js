const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  donorName: { type: String, required: true },
  donorEmail: { type: String, required: true },
  donorPhone: { type: String, required: true },
  panNumber: { type: String, default: '' },
  amount: { type: Number, required: true },
  campaignId: { type: String, default: 'general' },
  campaignTitle: { type: String, default: 'General NGO Social Welfare Fund' },
  paymentId: { type: String, default: '' },
  transactionId: { type: String, default: '' },
  orderId: { type: String, default: '' },
  paymentMethod: { type: String, default: 'UPI' },
  paymentScreenshot: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'success', 'approved', 'rejected'], 
    default: 'pending' 
  },
  is80GEligible: { type: Boolean, default: true },
  receiptNumber: { type: String, sparse: true, default: undefined },
  address: { type: String, default: '' },
  note: { type: String, default: '' },
  approvedAt: { type: Date, default: null },
  approvedBy: { type: String, default: null },
  rejectionReason: { type: String, default: null },
  isGuest: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
}, {
  timestamps: true
});

donationSchema.pre('save', function () {
  if (!this.receiptNumber) {
    this.receiptNumber = undefined;
  }
});

donationSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('Donation', donationSchema);
