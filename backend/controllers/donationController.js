const donationService = require('../services/donationService');

const createDonationOrder = async (req, res) => {
  try {
    const order = await donationService.createDonationOrder(req.body);
    return res.json({ success: true, order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const submitDonation = async (req, res) => {
  try {
    const donorUserId = req.user?.id || null;
    const donation = await donationService.submitDonation(req.body, donorUserId);
    return res.status(201).json({
      success: true,
      message: 'Donation submitted successfully! Pending Trustee verification before 80G receipt dispatch.',
      donation
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const approveDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const donation = await donationService.approveDonation(id, req.user);
    return res.json({
      success: true,
      message: `Donation approved! 80G Tax Receipt #${donation.receiptNumber} generated and emailed to donor.`,
      donation
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const rejectDonation = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const donation = await donationService.rejectDonation(id, reason, req.user);
    return res.json({
      success: true,
      message: 'Donation rejected',
      donation
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getDonations = async (req, res) => {
  try {
    const { status, donorId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (donorId) query.donor = donorId;
    const userRole = (req.user?.role || '').toLowerCase();
    const isAdminOrManager = userRole === 'admin' || userRole === 'manager' || req.isAdminSecretVerified;
    if (!isAdminOrManager) {
      query.donor = req.user?.id;
    }

    const donations = await donationService.getDonations(query);
    return res.json({ success: true, donations, total: donations.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const exportDonationsExcel = async (req, res) => {
  try {
    const buffer = await donationService.exportDonationsExcel();
    res.setHeader('Content-Disposition', 'attachment; filename="IYF_80G_Donations.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return res.send(buffer);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPublicDonation = async (req, res) => {
  try {
    const { receiptNo } = req.params;
    const details = await donationService.verifyPublicDonation(receiptNo);
    return res.json({ success: true, ...details });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

const deleteDonation = async (req, res) => {
  try {
    const { id } = req.params;
    await donationService.deleteDonation(id);
    return res.json({
      success: true,
      message: 'Donation record and associated receipt/screenshot files deleted successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  createDonationOrder,
  submitDonation,
  verifyAndRecordDonation: submitDonation, // alias for backwards compatibility
  approveDonation,
  rejectDonation,
  getDonations,
  exportDonationsExcel,
  verifyPublicDonation,
  deleteDonation
};
