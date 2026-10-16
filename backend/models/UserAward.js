const mongoose = require('mongoose');

const userAwardSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  awardId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Award' 
  },
  userName: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  userRole: { type: String, default: 'Member' },
  userPhoto: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  badgeIcon: { type: String, default: 'FiAward' },
  badgeColor: { type: String, default: 'gold' },
  badgeImage: { type: String, default: '' },
  category: { type: String, default: 'Social Service' },
  tier: { type: String, default: 'Gold' },
  reason: { type: String, required: true, trim: true },
  citation: { type: String, default: '' },
  awardedAt: { type: Date, default: Date.now },
  awardedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  awardedByName: { type: String, default: 'National Trustee Board' },
  badgeNumber: { type: String, default: '' }
}, {
  timestamps: true
});

userAwardSchema.pre('save', function () {
  if (!this.badgeNumber) {
    this.badgeNumber = `IYF-AWD-${Math.floor(100000 + Math.random() * 900000)}`;
  }
});

module.exports = mongoose.model('UserAward', userAwardSchema);
