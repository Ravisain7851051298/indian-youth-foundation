const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, default: 'General', trim: true },
  mediaType: { type: String, enum: ['photo', 'video'], default: 'photo' },
  url: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  videoUrl: { type: String, default: '' },
  caption: { type: String, default: '' },
  eventDate: { type: String, default: '' }
}, {
  timestamps: true
});

gallerySchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('Gallery', gallerySchema);
