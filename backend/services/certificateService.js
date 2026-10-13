const QRCode = require('qrcode');
const certificateRepository = require('../repositories/certificateRepository');
const userRepository = require('../repositories/userRepository');
const { sendCertificateEmail } = require('./emailService');

class CertificateService {
  async getCertificates(query = {}) {
    return certificateRepository.find(query);
  }

  async issueCertificate(certData, adminUser) {
    const { recipientId, recipientName, recipientEmail, title, titleHi, reason, reasonHi, roleOrDesignation } = certData;
    if (!recipientName) throw new Error('Recipient name is required');

    let recipientUser = null;
    if (recipientId) {
      recipientUser = await userRepository.findById(recipientId);
    } else if (recipientEmail) {
      recipientUser = await userRepository.findByEmail(recipientEmail);
    }

    const totalCerts = await certificateRepository.count();
    const certificateId = `BYK-CERT-2026-${String(totalCerts + 1).padStart(4, '0')}`;
    const verificationUrl = `https://bharatiyayuvakranti.org/verify/certificate/${certificateId}`;
    const qrCodeUrl = await QRCode.toDataURL(verificationUrl);

    const certificate = await certificateRepository.create({
      certificateId,
      recipient: recipientUser ? recipientUser._id : null,
      recipientName: recipientName || recipientUser?.name,
      recipientEmail: recipientEmail || recipientUser?.email || '',
      title: title || 'Certificate of Appreciation & National Service',
      titleHi: titleHi || 'प्रशंसा एवं राष्ट्र सेवा प्रमाण पत्र',
      reason: reason || 'In recognition of outstanding dedication and exemplary leadership for societal empowerment.',
      reasonHi: reasonHi || 'समाज सशक्तिकरण एवं राष्ट्र निर्माण में उत्कृष्ट योगदान के सम्मान स्वरूप।',
      roleOrDesignation: roleOrDesignation || recipientUser?.designation || 'Active Social Contributor',
      issueDate: new Date(),
      issuedBy: adminUser.name || 'राष्ट्रीय अध्यक्ष (National President)',
      qrCodeUrl,
      verified: true
    });

    if (certificate.recipientEmail) {
      await sendCertificateEmail(certificate);
    }

    return certificate;
  }

  async verifyPublicCertificate(certificateId) {
    const cert = await certificateRepository.findByCertificateId(certificateId);
    if (!cert) {
      throw new Error('Certificate not found or verification code is invalid');
    }

    return {
      verified: true,
      certificateId: cert.certificateId,
      recipientName: cert.recipientName,
      title: cert.title,
      reason: cert.reason,
      issueDate: cert.issueDate,
      issuedBy: cert.issuedBy
    };
  }
}

module.exports = new CertificateService();
