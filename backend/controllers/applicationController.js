const applicationService = require('../services/applicationService');

const applyMembership = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId || null;
    const application = await applicationService.applyMembership(userId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Membership application submitted successfully! Pending Trustee approval.',
      application
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const applyVolunteer = async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId || null;
    const application = await applicationService.applyVolunteer(userId, req.body);
    return res.status(201).json({
      success: true,
      message: 'Volunteer application submitted successfully! Pending Trustee verification.',
      application
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getMembershipApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await applicationService.getMembershipApplications(filter);
    return res.json({ success: true, applications, total: applications.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getVolunteerApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const applications = await applicationService.getVolunteerApplications(filter);
    return res.json({ success: true, applications, total: applications.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const approveMembershipApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await applicationService.approveMembershipApplication(id, req.user);
    return res.json({
      success: true,
      message: 'Membership approved! Official ID Card & Appointment Letter generated & emailed.',
      application: result.application,
      user: result.user
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const rejectMembershipApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const application = await applicationService.rejectMembershipApplication(id, reason, req.user);
    return res.json({
      success: true,
      message: 'Membership application rejected',
      application
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const approveVolunteerApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await applicationService.approveVolunteerApplication(id, req.user);
    return res.json({
      success: true,
      message: 'Volunteer verified! Badge and offer letter generated & emailed.',
      application: result.application,
      user: result.user
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const rejectVolunteerApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const application = await applicationService.rejectVolunteerApplication(id, reason, req.user);
    return res.json({
      success: true,
      message: 'Volunteer application rejected',
      application
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteMembershipApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await applicationService.deleteMembershipApplication(id);
    return res.json({
      success: true,
      message: 'Membership application and associated proof files deleted successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteVolunteerApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await applicationService.deleteVolunteerApplication(id);
    return res.json({
      success: true,
      message: 'Volunteer application and associated ID files deleted successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyMembership,
  applyVolunteer,
  getMembershipApplications,
  getVolunteerApplications,
  approveMembershipApplication,
  rejectMembershipApplication,
  approveVolunteerApplication,
  rejectVolunteerApplication,
  deleteMembershipApplication,
  deleteVolunteerApplication
};
