const Event = require('../models/Event');

class EventRepository {
  async create(data) {
    const event = new Event(data);
    return event.save();
  }

  async findById(id) {
    return Event.findById(id);
  }

  async find(query = {}, sort = { createdAt: -1 }) {
    return Event.find(query).sort(sort);
  }

  async updateById(id, data) {
    return Event.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  }

  async deleteById(id) {
    return Event.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return Event.countDocuments(query);
  }
}

module.exports = new EventRepository();
