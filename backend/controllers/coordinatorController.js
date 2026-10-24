const coordinatorService = require('../services/coordinatorService');

const createCoordinator = async (req, res) => {
  try {
    const result = await coordinatorService.createCoordinator(req.user, req.body);
    return res.status(201).json({
      success: true,
      message: 'Coordinator created successfully! Official Appointment Letter & ID Card generated and emailed.',
      coordinator: result.coordinator,
      temporaryPassword: result.temporaryPassword
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const promoteUserToCoordinator = async (req, res) => {
  try {
    const userId = req.params.userId || req.params.id || req.body.userId || req.body.id || req.body._id || req.body.email || req.body.phone || req.query.userId || req.query.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID, Email, or Phone is required to promote to Coordinator.' });
    }
    const result = await coordinatorService.promoteUserToCoordinator(req.user, userId, req.body);
    return res.json({
      success: true,
      message: 'User successfully promoted to Coordinator! Official Appointment Letter & ID Card generated and emailed.',
      coordinator: result.coordinator,
      temporaryPassword: result.temporaryPassword
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getAllCoordinators = async (req, res) => {
  try {
    const coordinators = await coordinatorService.getAllCoordinators();
    return res.json({
      success: true,
      coordinators,
      total: coordinators.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getCoordinatorMembers = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await coordinatorService.getCoordinatorMembers(id);
    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getMyStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await coordinatorService.getMyCoordinatorStats(userId);
    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getMyMembers = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await coordinatorService.getMyMembers(userId);
    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const addMemberByCoordinator = async (req, res) => {
  try {
    const application = await coordinatorService.addMemberByCoordinator(req.user, req.body);
    return res.status(201).json({
      success: true,
      message: 'New member enrolled successfully! Submitted to Admin for final verification and approval.',
      application
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const resendCredentials = async (req, res) => {
  try {
    const id = req.params.id || req.body?.id || req.body?.coordinatorId || req.body?.userId;
    if (!id) {
      return res.status(400).json({ success: false, message: 'Coordinator ID or identifier is required.' });
    }
    const result = await coordinatorService.resendCoordinatorCredentials(req.user, id);
    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateMemberByCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedApplication = await coordinatorService.updateMemberByCoordinator(req.user, id, req.body);
    return res.json({
      success: true,
      message: 'Member details updated successfully!',
      application: updatedApplication,
      data: updatedApplication
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteMemberByCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await coordinatorService.deleteMemberByCoordinator(req.user, id);
    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const coordinator = await coordinatorService.updateCoordinator(req.user, id, req.body);
    return res.json({
      success: true,
      message: `Coordinator profile for ${coordinator.name} updated successfully!`,
      coordinator,
      data: coordinator
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCoordinator = async (req, res) => {
  try {
    const { id } = req.params;
    const action = req.query.action || req.body.action || (req.query.hardDelete ? 'delete' : 'revoke');
    const result = await coordinatorService.deleteCoordinator(req.user, id, { action });
    return res.json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCoordinator,
  promoteUserToCoordinator,
  getAllCoordinators,
  getCoordinatorMembers,
  getMyStats,
  getMyMembers,
  addMemberByCoordinator,
  resendCredentials,
  updateMemberByCoordinator,
  deleteMemberByCoordinator,
  updateCoordinator,
  deleteCoordinator
};
