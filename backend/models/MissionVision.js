const mongoose = require('mongoose');

const missionVisionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    enum: ['Mission', 'Vision', 'Core Value', 'Objective', 'Philosophy'], 
    default: 'Mission' 
  },
  description: { type: String, required: true, trim: true },
  icon: { type: String, default: 'FiCompass', trim: true },
  points: { type: [String], default: [] },
  image: { type: String, default: '', trim: true },
  order: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
  timestamps: true
});

missionVisionSchema.plugin(require('./plugins/fileCleanupPlugin'));

module.exports = mongoose.model('MissionVision', missionVisionSchema);
