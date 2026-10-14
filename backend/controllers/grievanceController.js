const grievanceService = require('../services/grievanceService');

const submitGrievance = async (req, res) => {
  try {
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
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;
    if (req.user?.role !== 'Admin' && req.user?.role !== 'Manager') {
      query.user = req.user.id;
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
      message: 'Grievance updated successfully',
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
