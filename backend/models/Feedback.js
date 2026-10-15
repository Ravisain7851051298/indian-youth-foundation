const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true, trim: true },
  email: { type: String, default: '', trim: true, lowercase: true },
  phone: { type: String, default: '', trim: true },
  userRole: { type: String, default: 'Supporter', trim: true },
  profilePicture: { type: String, default: '', trim: true },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  status: { type: String, enum: ['Approved', 'Pending', 'Rejected'], default: 'Approved' },

  // Admin Reply functionality
  adminReply: { type: String, default: '', trim: true },
  adminRepliedAt: { type: Date },
  repliedBy: { type: String, default: '', trim: true },
  repliedByRole: { type: String, default: 'Admin', trim: true }
}, {
  timestamps: true
});

feedbackSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('Feedback', feedbackSchema);
