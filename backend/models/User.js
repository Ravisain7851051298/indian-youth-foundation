const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Member', 'Volunteer', 'TeamMember', 'Donor'], 
    default: 'Donor' 
  },
  status: { 
    type: String, 
    enum: ['active', 'blocked', 'deactivated', 'pending'], 
    default: 'active' 
  },
  memberId: { type: String, unique: true, sparse: true },
  volunteerId: { type: String, sparse: true },
  isMember: { type: Boolean, default: false },
  isVolunteer: { type: Boolean, default: false },
  volunteerWing: { type: String, default: 'Grassroots Social Welfare' },
  volunteerStatus: { type: String, default: 'active' },
  designation: { type: String, default: 'Applicant - Member Wing' },
  bloodGroup: { type: String, default: 'O+' },
  dob: { type: String, default: '2000-01-01' },
  address: { type: String, default: '' },
  district: { type: String, default: 'Aligarh' },
  state: { type: String, default: 'Uttar Pradesh' },
  photoUrl: { type: String, default: '' },
  documentType: { type: String, default: '' },
  documentFront: { type: String, default: '' },
  documentBack: { type: String, default: '' },
  referralCode: { type: String, sparse: true },
  referredBy: { type: String, default: null },
  feePaid: { type: Boolean, default: false },
  feeAmount: { type: Number, default: 0 },
  membershipPlan: { type: String, default: '' },
  membershipPlanId: { type: String, default: null },
  idCardGenerated: { type: Boolean, default: false },
  appointmentLetterGenerated: { type: Boolean, default: false },
  qrCodeUrl: { type: String, default: '' },
  verifiedAt: { type: Date, default: null },
  verifiedBy: { type: String, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  notes: { type: String, default: '' }
}, {
  timestamps: true
});

userSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('User', userSchema);
