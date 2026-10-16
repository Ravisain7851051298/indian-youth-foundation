const mongoose = require('mongoose');
const fileCleanupPlugin = require('./plugins/fileCleanupPlugin');

const grievanceSchema = new mongoose.Schema({
  ticketNumber: { type: String, unique: true, sparse: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: { type: String, default: '' },
  memberName: { type: String, default: '' },
  phone: { type: String, default: '' },
  memberPhone: { type: String, default: '' },
  email: { type: String, default: '' },
  memberEmail: { type: String, default: '' },
  memberId: { type: String, default: '' },
  subject: { type: String, required: true },
  message: { type: String, default: '' },
  description: { type: String, default: '' },
  attachment: { type: String, default: '' },
  attachments: [{ type: String }],
  imageUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'resolved', 'closed'], 
    default: 'pending' 
  },
  adminAnswer: { type: String, default: '' },
  adminAnsweredAt: { type: Date },
  resolutionNotes: { type: String, default: '' },
  resolvedBy: { type: String, default: '' },
  resolvedAt: { type: Date }
}, {
  timestamps: true
});

grievanceSchema.pre('save', function () {
  if (this.name && !this.memberName) this.memberName = this.name;
  if (this.memberName && !this.name) this.name = this.memberName;
  if (this.phone && !this.memberPhone) this.memberPhone = this.phone;
  if (this.memberPhone && !this.phone) this.phone = this.memberPhone;
  if (this.email && !this.memberEmail) this.memberEmail = this.email;
  if (this.memberEmail && !this.email) this.email = this.memberEmail;
  if (this.message && !this.description) this.description = this.message;
  if (this.description && !this.message) this.message = this.description;
  if (this.adminAnswer && !this.resolutionNotes) this.resolutionNotes = this.adminAnswer;
  if (this.resolutionNotes && !this.adminAnswer) this.adminAnswer = this.resolutionNotes;
});

grievanceSchema.plugin(fileCleanupPlugin);

module.exports = mongoose.model('Grievance', grievanceSchema);
