const memberService = require('../services/memberService');

const getMembers = async (req, res) => {
  try {
    const members = await memberService.getMembers(req.query);
    return res.json({ success: true, members, total: members.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getPublicMembers = async (req, res) => {
  try {
    const { limit } = req.query;
    const result = await memberService.getPublicMembers(limit);
    return res.json({ success: true, ...result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateMemberStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const member = await memberService.updateMemberStatus(id, status);
    return res.json({ success: true, message: `Member status updated to '${status}'`, member });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const verifyMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await memberService.verifyMember(id, req.body);
    return res.json({
      success: true,
      message: 'Member successfully verified! ID Card and Appointment Letter activated.',
      member
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const exportMembersExcel = async (req, res) => {
  try {
    const buffer = await memberService.exportMembersExcel();
    res.setHeader('Content-Disposition', 'attachment; filename="IYF_Members_List.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPublicMember = async (req, res) => {
  try {
    const { id } = req.params;
    const details = await memberService.verifyPublicMember(id);
    return res.json({ success: true, verified: true, member: details });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

const getBirthdayMembers = async (req, res) => {
  return res.json({ success: true, todayBirthdays: [], candidates: [] });
};

const getCoordinatorReport = async (req, res) => {
  try {
    const data = await memberService.getCoordinatorReport(req.user.id);
    return res.json({ success: true, ...data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getAllCoordinatorsStats = async (req, res) => {
  try {
    const data = await memberService.getAllCoordinatorsStats();
    return res.json({ success: true, coordinatorLeaderboard: data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    await memberService.deleteMember(id);
    return res.json({
      success: true,
      message: 'Member account and associated photo/QR files deleted successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMembers,
  getPublicMembers,
  updateMemberStatus,
  verifyMember,
  exportMembersExcel,
  verifyPublicMember,
  getBirthdayMembers,
  getCoordinatorReport,
  getAllCoordinatorsStats,
  deleteMember
};
