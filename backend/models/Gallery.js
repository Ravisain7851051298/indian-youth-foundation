const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['photo', 'video'], default: 'photo' },
  url: { type: String, required: true },
  caption: { type: String, default: '' },
  eventDate: { type: String, default: '' }
}, {
  timestamps: true
});

gallerySchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('Gallery', gallerySchema);
