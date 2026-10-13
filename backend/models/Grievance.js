const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  memberName: { type: String, required: true },
  memberPhone: { type: String, required: true },
  memberEmail: { type: String, default: '' },
  memberId: { type: String, default: '' },
  subject: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'resolved'], 
    default: 'pending' 
  },
  resolutionNotes: { type: String, default: '' },
  resolvedBy: { type: String, default: '' },
  resolvedAt: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('Grievance', grievanceSchema);
