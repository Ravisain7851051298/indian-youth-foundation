const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  department: { type: String, default: 'Leadership & Board', trim: true },
  bio: { type: String, default: '', trim: true },
  email: { type: String, default: '', trim: true },
  phone: { type: String, default: '', trim: true },
  image: { type: String, default: '', trim: true },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  timestamps: true
});

teamMemberSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('TeamMember', teamMemberSchema);
