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
  category: { 
    type: String, 
    default: function() { 
      return (this.tags && this.tags.length > 0) ? this.tags[0] : 'News'; 
    } 
  },
  author: { type: String, default: 'संपादक, युवा क्रांति दल' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

newsSchema.pre('validate', function() {
  if (!this.titleHi && this.title) this.titleHi = this.title;
  if (!this.contentHi && this.content) this.contentHi = this.content;
  if (!this.date) this.date = new Date().toISOString().split('T')[0];
  if (!this.category && this.tags && this.tags.length > 0) {
    this.category = this.tags[0];
  } else if (!this.tags || this.tags.length === 0) {
    if (this.category) this.tags = [this.category];
  }
});

newsSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('News', newsSchema);

