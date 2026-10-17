const grievanceService = require('../services/grievanceService');

const submitGrievance = async (req, res) => {
  try {
    // Process optional uploaded files
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const category = file.category || 'grievances';
        const fileUrl = `/uploads/${category}/${file.filename}`;
        const isVideo = file.mimetype?.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi|3gp)$/i.test(file.filename);
        
        if (isVideo) {
          req.body.videoUrl = fileUrl;
        } else {
          req.body.imageUrl = fileUrl;
        }

        if (!req.body.attachments) req.body.attachments = [];
        if (Array.isArray(req.body.attachments)) {
          req.body.attachments.push(fileUrl);
        }
      });
    } else if (req.file) {
      const category = req.file.category || 'grievances';
      const fileUrl = `/uploads/${category}/${req.file.filename}`;
      const isVideo = req.file.mimetype?.startsWith('video/') || /\.(mp4|webm|mov|mkv|avi|3gp)$/i.test(req.file.filename);

      if (isVideo) {
        req.body.videoUrl = fileUrl;
      } else {
        req.body.imageUrl = fileUrl;
      }
      req.body.attachment = fileUrl;
    }

    const grievance = await grievanceService.submitGrievance(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: `Grievance submitted successfully. Your Ticket Number is #${grievance.ticketNumber}.`,
      grievance
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getGrievances = async (req, res) => {
  try {
    const { status, email, phone } = req.query;
    const query = {};
    if (status) query.status = status;

    const userRole = (req.user?.role || '').toLowerCase();
    const isAdmin = userRole === 'admin' || userRole === 'manager' || userRole === 'superadmin';

    if (!isAdmin) {
      const userEmail = (req.user?.email || email || '').trim().toLowerCase();
      const userPhone = (req.user?.phone || phone || '').trim();
      const userId = req.user?.id || req.user?._id;

      const orConditions = [];
      if (userId) orConditions.push({ user: userId });
      if (userEmail) {
        orConditions.push({ email: userEmail });
        orConditions.push({ memberEmail: userEmail });
      }
      if (userPhone) {
        orConditions.push({ phone: userPhone });
        orConditions.push({ memberPhone: userPhone });
      }

      if (orConditions.length > 0) {
        query.$or = orConditions;
      }
    }

    const grievances = await grievanceService.getGrievances(query);
    return res.json({ success: true, grievances, total: grievances.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateGrievance = async (req, res) => {
  try {
    const { id } = req.params;
    const grievance = await grievanceService.updateGrievance(id, req.body, req.user);
    return res.json({
      success: true,
      message: 'Grievance resolution and answer updated successfully',
      grievance
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteGrievance = async (req, res) => {
  try {
    const { id } = req.params;
    await grievanceService.deleteGrievance(id);
    return res.json({
      success: true,
      message: 'Grievance ticket and any attached files deleted successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  submitGrievance,
  getGrievances,
  updateGrievance,
  deleteGrievance
};
