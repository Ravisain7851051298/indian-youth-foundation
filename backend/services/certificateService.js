const QRCode = require('qrcode');
const certificateRepository = require('../repositories/certificateRepository');
const userRepository = require('../repositories/userRepository');
const { sendCertificateEmail } = require('./emailService');

class CertificateService {
  async getCertificates(query = {}) {
    return certificateRepository.find(query);
  }

  async generateUniqueCertificateId() {
    const currentYear = new Date().getFullYear();
    const prefix = `BYK-CERT-${currentYear}-`;
    const certs = await certificateRepository.findCertsWithPrefix(prefix);
    let maxSeq = 0;
    for (const c of certs) {
      if (c.certificateId) {
        const match = c.certificateId.match(/(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxSeq) maxSeq = num;
        }
      }
    }
    let nextSeq = maxSeq + 1;
    let candidate = `${prefix}${String(nextSeq).padStart(4, '0')}`;
    while (await certificateRepository.findByCertificateId(candidate)) {
      nextSeq++;
      candidate = `${prefix}${String(nextSeq).padStart(4, '0')}`;
    }
    return candidate;
  }

  async issueCertificate(certData, adminUser = {}) {
    const { recipientId, recipientName, recipientEmail, title, titleHi, reason, reasonHi, roleOrDesignation } = certData;
    if (!recipientName) throw new Error('Recipient name is required');

    let recipientUser = null;
    const cleanEmail = (recipientEmail || '').trim().toLowerCase();
    const cleanId = (recipientId || '').toString().trim();
    const mongoose = require('mongoose');

    if (cleanEmail) {
      recipientUser = await userRepository.findByEmail(cleanEmail);
    }
    if (!recipientUser && cleanId) {
      if (mongoose.Types.ObjectId.isValid(cleanId)) {
        recipientUser = await userRepository.findById(cleanId);
      }
      if (!recipientUser) {
        recipientUser = await userRepository.findByMemberId(cleanId);
      }
    }

    const certificateId = await this.generateUniqueCertificateId();
    const verificationUrl = `https://bharatiyayuvakranti.org/verify/certificate/${certificateId}`;
    const qrCodeUrl = await QRCode.toDataURL(verificationUrl);

    const certificate = await certificateRepository.create({
      certificateId,
      certificateNo: certificateId,
      recipient: recipientUser ? recipientUser._id : (mongoose.Types.ObjectId.isValid(cleanId) ? cleanId : null),
      recipientName: recipientName || recipientUser?.name,
      recipientId: recipientUser?.memberId || cleanId || '',
      recipientEmail: cleanEmail || recipientUser?.email || '',
      recipientPhone: recipientUser?.phone || '',
      title: title || 'Certificate of Appreciation & National Service',
      titleHi: titleHi || 'प्रशंसा एवं राष्ट्र सेवा प्रमाण पत्र',
      awardTitle: title || 'Certificate of Appreciation & National Service',
      reason: reason || 'In recognition of outstanding dedication and exemplary leadership for societal empowerment.',
      reasonHi: reasonHi || 'समाज सशक्तिकरण एवं राष्ट्र निर्माण में उत्कृष्ट योगदान के सम्मान स्वरूप।',
      description: reason || 'In recognition of outstanding dedication and exemplary leadership for societal empowerment.',
      roleOrDesignation: roleOrDesignation || recipientUser?.designation || 'Active Social Contributor',
      issueDate: new Date(),
      issuedBy: (adminUser && adminUser.name) ? adminUser.name : 'राष्ट्रीय अध्यक्ष (National President)',
      qrCodeUrl,
      verified: true
    });

    if (certificate.recipientEmail) {
      try {
        await sendCertificateEmail(certificate);
      } catch (emailErr) {
        console.error('⚠️ [CERTIFICATE EMAIL ERROR]:', emailErr.message);
      }
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

  async deleteCertificate(id) {
    const cert = await certificateRepository.findById(id);
    if (!cert) throw new Error('Certificate not found');
    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(cert);
    return certificateRepository.deleteById(id);
  }
}

module.exports = new CertificateService();
