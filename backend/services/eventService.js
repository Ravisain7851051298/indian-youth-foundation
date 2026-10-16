const eventRepository = require('../repositories/eventRepository');

class EventService {
  async getEvents(query = {}) {
    return eventRepository.find(query);
  }

  async getEventById(id) {
    const event = await eventRepository.findById(id);
    if (!event) throw new Error('Event not found');
    return event;
  }

  async createEvent(data) {
    if (!data.title || !data.date || !data.location) {
      throw new Error('Title, date, and location are required');
    }

    // Process images array (max 5)
    let images = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
    if (data.image && !images.includes(data.image)) {
      images.unshift(data.image);
    }
    if (images.length > 5) {
      images = images.slice(0, 5);
    }
    data.images = images;
    data.image = images[0] || data.image || '';

    return eventRepository.create(data);
  }

  async updateEvent(id, data) {
    // Process images array (max 5)
    if (data.images !== undefined) {
      let images = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
      if (data.image && !images.includes(data.image)) {
        images.unshift(data.image);
      }
      if (images.length > 5) {
        images = images.slice(0, 5);
      }
      data.images = images;
      data.image = images[0] || data.image || '';
    }

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

  async joinEvent(id, { name, email, phone, message, userId }) {
    if (!name || !name.trim()) throw new Error('Full name is required to join');
    if (!phone || !phone.trim()) throw new Error('Contact phone number is required to join');

    const event = await eventRepository.findById(id);
    if (!event) throw new Error('Event not found');

    // Check if phone or email is already registered
    const cleanPhone = phone.trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    const alreadyJoined = event.attendees.some(att => {
      const matchPhone = att.phone && att.phone.trim() === cleanPhone;
      const matchEmail = cleanEmail && att.email && att.email.trim().toLowerCase() === cleanEmail;
      return matchPhone || matchEmail;
    });

    if (alreadyJoined) {
      throw new Error('You have already registered for this event with this phone number or email.');
    }

    event.attendees.push({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      message: (message || '').trim(),
      user: userId || undefined,
      registeredAt: new Date()
    });

    await event.save();
    return event;
  }

  async getAttendees(id) {
    const event = await eventRepository.findById(id);
    if (!event) throw new Error('Event not found');
    return event.attendees || [];
  }

  async removeAttendee(id, attendeeId) {
    const event = await eventRepository.findById(id);
    if (!event) throw new Error('Event not found');

    event.attendees = event.attendees.filter(att => att._id.toString() !== attendeeId.toString());
    await event.save();
    return event;
  }
}

module.exports = new EventService();
