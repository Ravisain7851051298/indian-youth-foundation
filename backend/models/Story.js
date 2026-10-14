const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  beneficiary: { type: String, default: 'Beneficiary', trim: true },
  category: { type: String, default: 'Education Impact', trim: true },
  summary: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  image: { type: String, default: '', trim: true },
  date: { type: String, default: '', trim: true },
  status: { type: String, default: 'active' }
}, {
  timestamps: true
});

storySchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('Story', storySchema);
