const mongoose = require('mongoose');

const volunteerApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  skills: { type: String, default: '' },
  availability: { type: String, default: 'Weekends' },
  interests: { type: String, default: '' },
  idProofUrl: { type: String, default: '' },
  whyJoin: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  assignedVolunteerId: { type: String, default: null },
  verifiedAt: { type: Date, default: null },
  verifiedBy: { type: String, default: null },
  rejectionReason: { type: String, default: null }
}, {
  timestamps: true
});

module.exports = mongoose.model('VolunteerApplication', volunteerApplicationSchema);
