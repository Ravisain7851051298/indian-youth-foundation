const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleHi: { 
    type: String, 
    default: function() { return this.title || ''; } 
  },
  content: { type: String, required: true },
  contentHi: { 
    type: String, 
    default: function() { return this.content || ''; } 
  },
  date: { 
    type: String, 
    default: () => new Date().toISOString().split('T')[0] 
  },
  image: { type: String, default: '' },
  tags: [{ type: String }],
  author: { type: String, default: 'संपादक, भारतीय युवा क्रांति' }
}, {
  timestamps: true
});

newsSchema.pre('validate', function() {
  if (!this.titleHi && this.title) this.titleHi = this.title;
  if (!this.contentHi && this.content) this.contentHi = this.content;
  if (!this.date) this.date = new Date().toISOString().split('T')[0];
});

newsSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('News', newsSchema);
