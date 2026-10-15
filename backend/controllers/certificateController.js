const certificateService = require('../services/certificateService');
const pdfService = require('../services/pdfService');
const certificateRepository = require('../repositories/certificateRepository');

const getCertificates = async (req, res) => {
  try {
    const { recipientId } = req.query;
    const query = {};
    if (recipientId) query.recipient = recipientId;

    if (req.user) {
      const userRole = (req.user.role || '').toLowerCase();
      if (userRole !== 'admin' && userRole !== 'manager') {
        const orConditions = [];
        if (req.user.id || req.user._id) orConditions.push({ recipient: req.user.id || req.user._id });
        if (req.user.email) orConditions.push({ recipientEmail: req.user.email.toLowerCase().trim() });
        if (req.user.memberId) orConditions.push({ recipientId: req.user.memberId });
        if (req.user.volunteerId) orConditions.push({ recipientId: req.user.volunteerId });
        if (req.user.volunteerApplication?.volunteerId) orConditions.push({ recipientId: req.user.volunteerApplication.volunteerId });
        if (req.user.phone) orConditions.push({ recipientPhone: req.user.phone.trim() });
        if (req.user.name) orConditions.push({ recipientName: req.user.name.trim() });
        if (orConditions.length > 0) {
          query.$or = orConditions;
        }
      }
    } else if (!recipientId) {
      // Unauthenticated public request: show verified certificates
      query.verified = true;
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

const downloadCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    let cert = null;
    if (id.startsWith('BYK-CERT-')) {
      cert = await certificateRepository.findByCertificateId(id);
    }
    if (!cert && id.match(/^[0-9a-fA-F]{24}$/)) {
      cert = await certificateRepository.findById(id);
    }
    if (!cert) {
      cert = await certificateRepository.findByCertificateId(id);
    }
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    const pdfBuffer = await pdfService.generateCertificatePdf(cert);
    const certCode = cert.certificateId || cert.certificateNo || 'Award_Certificate';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Certificate_${certCode}.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    await certificateService.deleteCertificate(id);
    return res.json({
      success: true,
      message: 'Certificate and associated media files deleted successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCertificates,
  issueCertificate,
  verifyPublicCertificate,
  downloadCertificate,
  deleteCertificate
};
