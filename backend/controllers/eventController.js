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

const createEvent = async (req, res) => {
  try {
    if (req.file) {
      const category = req.file.category || 'events';
      req.body.image = `/uploads/${category}/${req.file.filename}`;
    } else if (req.body.imageUrl && !req.body.image) {
      req.body.image = req.body.imageUrl;
    }

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
    if (req.file) {
      const category = req.file.category || 'events';
      req.body.image = `/uploads/${category}/${req.file.filename}`;
    } else if (req.body.imageUrl && !req.body.image) {
      req.body.image = req.body.imageUrl;
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

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
