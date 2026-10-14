const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    index: true
  },
  userEmail: {
    type: String,
    default: ''
  },
  reason: {
    type: String,
    enum: ['logout', 'revoked', 'password_reset', 'security_invalidation'],
    default: 'logout'
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Space Optimization: MongoDB TTL (Time-To-Live) index automatically deletes documents once expiresAt is reached
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
