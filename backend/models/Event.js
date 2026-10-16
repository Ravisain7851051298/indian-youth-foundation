const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, default: '' },
  registeredAt: { type: Date, default: Date.now }
});

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleHi: { type: String, default: '' },
  description: { type: String, required: true },
  descriptionHi: { type: String, default: '' },
  date: { type: String, required: true },
  time: { type: String, default: '10:00 AM' },
  location: { type: String, required: true },
  locationAddress: { type: String, default: '' },
  image: { type: String, default: '' },
  images: {
    type: [{ type: String }],
    validate: [
      function (val) {
        return val.length <= 5;
      },
      'Cannot upload more than 5 images per event'
    ],
    default: []
  },
  isUpcoming: { type: Boolean, default: true },
  attendees: [attendeeSchema]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

eventSchema.virtual('attendeeCount').get(function () {
  return this.attendees ? this.attendees.length : 0;
});

eventSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('Event', eventSchema);
