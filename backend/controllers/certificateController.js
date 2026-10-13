const certificateService = require('../services/certificateService');

const getCertificates = async (req, res) => {
  try {
    const { recipientId } = req.query;
    const query = {};
    if (recipientId) query.recipient = recipientId;
    if (req.user?.role !== 'Admin' && req.user?.role !== 'Manager') {
      query.$or = [{ recipient: req.user.id }, { recipientEmail: req.user.email }];
    }

    const certificates = await certificateService.getCertificates(query);
    return res.json({ success: true, certificates, total: certificates.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const issueCertificate = async (req, res) => {
  try {
    const certificate = await certificateService.issueCertificate(req.body, req.user);
    return res.status(201).json({
      success: true,
      message: 'Certificate issued and emailed to recipient!',
      certificate
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const verifyPublicCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const details = await certificateService.verifyPublicCertificate(id);
    return res.json({ success: true, ...details });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCertificates,
  issueCertificate,
  verifyPublicCertificate
};
