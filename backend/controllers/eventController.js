const eventService = require('../services/eventService');

const getEvents = async (req, res) => {
  try {
    const { upcoming } = req.query;
    const query = {};
    if (upcoming !== undefined) query.isUpcoming = upcoming === 'true';

    const events = await eventService.getEvents(query);
    return res.json({ success: true, events, total: events.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id);
    return res.json({ success: true, event });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    // Parse images from body if sent as JSON string
    let parsedImages = [];
    if (typeof req.body.images === 'string') {
      try {
        parsedImages = JSON.parse(req.body.images);
      } catch (e) {
        parsedImages = req.body.images.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(req.body.images)) {
      parsedImages = req.body.images;
    }

    // Process uploaded files (up to 5)
    if (req.files && req.files.length > 0) {
      const fileUrls = req.files.map(f => {
        const category = f.category || 'events';
        return `/uploads/${category}/${f.filename}`;
      });
      parsedImages = [...parsedImages, ...fileUrls];
    } else if (req.file) {
      const category = req.file.category || 'events';
      const fileUrl = `/uploads/${category}/${req.file.filename}`;
      parsedImages.push(fileUrl);
    } else if (req.body.imageUrl && !parsedImages.includes(req.body.imageUrl)) {
      parsedImages.push(req.body.imageUrl);
    } else if (req.body.image && !parsedImages.includes(req.body.image)) {
      parsedImages.push(req.body.image);
    }

    req.body.images = parsedImages.slice(0, 5);
    req.body.image = req.body.images[0] || req.body.image || '';

    const event = await eventService.createEvent(req.body);
    return res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    // Parse images from body if sent as JSON string
    let parsedImages = [];
    if (typeof req.body.images === 'string') {
      try {
        parsedImages = JSON.parse(req.body.images);
      } catch (e) {
        parsedImages = req.body.images.split(',').map(s => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(req.body.images)) {
      parsedImages = req.body.images;
    }

    // Process newly uploaded files
    if (req.files && req.files.length > 0) {
      const fileUrls = req.files.map(f => {
        const category = f.category || 'events';
        return `/uploads/${category}/${f.filename}`;
      });
      parsedImages = [...parsedImages, ...fileUrls];
    } else if (req.file) {
      const category = req.file.category || 'events';
      const fileUrl = `/uploads/${category}/${req.file.filename}`;
      parsedImages.push(fileUrl);
    }

    if (parsedImages.length > 0) {
      req.body.images = parsedImages.slice(0, 5);
      req.body.image = req.body.images[0] || req.body.image || '';
    }

    const event = await eventService.updateEvent(id, req.body);
    return res.json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await eventService.deleteEvent(id);
    return res.json({
      success: true,
      message: 'Event deleted successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const joinEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, message } = req.body;
    const userId = req.user?._id || req.user?.id;

    const event = await eventService.joinEvent(id, { name, email, phone, message, userId });
    return res.status(200).json({
      success: true,
      message: 'Congratulations! You have successfully registered for this event.',
      attendeeCount: event.attendees.length,
      event
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getEventAttendees = async (req, res) => {
  try {
    const { id } = req.params;
    const attendees = await eventService.getAttendees(id);
    return res.json({
      success: true,
      attendees,
      total: attendees.length
    });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

const removeAttendee = async (req, res) => {
  try {
    const { id, attendeeId } = req.params;
    const event = await eventService.removeAttendee(id, attendeeId);
    return res.json({
      success: true,
      message: 'Attendee removed successfully',
      attendeeCount: event.attendees.length,
      event
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  joinEvent,
  getEventAttendees,
  removeAttendee
};
