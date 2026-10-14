const eventRepository = require('../repositories/eventRepository');

class EventService {
  async getEvents(query = {}) {
    return eventRepository.find(query);
  }

  async createEvent(data) {
    if (!data.title || !data.date || !data.location) {
      throw new Error('Title, date, and location are required');
    }
    return eventRepository.create(data);
  }

  async updateEvent(id, data) {
    const event = await eventRepository.updateById(id, data);
    if (!event) throw new Error('Event not found');
    return event;
  }

  async deleteEvent(id) {
    const event = await eventRepository.deleteById(id);
    if (!event) throw new Error('Event not found');
    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(event);
    return event;
  }
}

module.exports = new EventService();
