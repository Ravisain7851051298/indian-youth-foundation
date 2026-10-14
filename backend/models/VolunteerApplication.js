const mongoose = require('mongoose');
const fileCleanupPlugin = require('./plugins/fileCleanupPlugin');

const volunteerApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  skills: { type: mongoose.Schema.Types.Mixed, default: '' },
  availability: { type: String, default: 'Weekends' },
  interests: { type: String, default: '' },
  idProofUrl: { type: String, default: '' },
  idProofDocument: { type: String, default: '' },
  whyJoin: { type: String, default: '' },
  motivation: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  assignedVolunteerId: { type: String, default: null },
  verifiedAt: { type: Date, default: null },
  verifiedBy: { type: String, default: null },
  reviewedAt: { type: Date, default: null },
  reviewedBy: { type: String, default: null },
  rejectionReason: { type: String, default: null }
}, {
  timestamps: true
});

volunteerApplicationSchema.pre('save', function () {
  if (this.user && !this.userId) this.userId = this.user;
  if (this.userId && !this.user) this.user = this.userId;
  if (this.idProofUrl && !this.idProofDocument) this.idProofDocument = this.idProofUrl;
  if (this.idProofDocument && !this.idProofUrl) this.idProofUrl = this.idProofDocument;
  if (this.whyJoin && !this.motivation) this.motivation = this.whyJoin;
  if (this.motivation && !this.whyJoin) this.whyJoin = this.motivation;
});

volunteerApplicationSchema.plugin(fileCleanupPlugin);

module.exports = mongoose.model('VolunteerApplication', volunteerApplicationSchema);
