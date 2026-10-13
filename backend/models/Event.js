const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleHi: { type: String, required: true },
  description: { type: String, required: true },
  descriptionHi: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, default: '10:00 AM' },
  location: { type: String, required: true },
  image: { type: String, default: '' },
  isUpcoming: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
