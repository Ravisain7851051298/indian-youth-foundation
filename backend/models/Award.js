const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  badgeIcon: { type: String, default: 'FiAward' },
  badgeColor: { type: String, enum: ['gold', 'red', 'emerald', 'blue', 'purple'], default: 'gold' },
  badgeImage: { type: String, default: '' },
  category: { 
    type: String, 
    default: 'Social Service',
    trim: true 
  },
  tier: { 
    type: String, 
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Special Honor'], 
    default: 'Gold' 
  },
  points: { type: Number, default: 100 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

awardSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('Award', awardSchema);
