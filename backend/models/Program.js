const mongoose = require('mongoose');

const programSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, default: 'Youth Empowerment', trim: true },
  description: { type: String, required: true, trim: true },
  objectives: { type: [String], default: [] },
  image: { type: String, default: '', trim: true },
  date: { type: String, default: '', trim: true },
  status: { type: String, enum: ['active', 'completed', 'upcoming'], default: 'active' }
}, {
  timestamps: true
});

programSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('Program', programSchema);
