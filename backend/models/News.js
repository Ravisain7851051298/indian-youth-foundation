const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleHi: { type: String, required: true },
  content: { type: String, required: true },
  contentHi: { type: String, required: true },
  date: { type: String, required: true },
  image: { type: String, default: '' },
  tags: [{ type: String }],
  author: { type: String, default: 'संपादक, भारतीय युवा क्रांति' }
}, {
  timestamps: true
});

newsSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('News', newsSchema);
