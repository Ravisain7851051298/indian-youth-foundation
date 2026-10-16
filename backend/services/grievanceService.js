const grievanceRepository = require('../repositories/grievanceRepository');

class GrievanceService {
  async submitGrievance(data, user) {
    const { 
      name, 
      memberName, 
      email, 
      memberEmail, 
      phone, 
      memberPhone, 
      memberId, 
      subject, 
      message, 
      description,
      imageUrl,
      videoUrl,
      attachment,
      attachments 
    } = data;

    const finalName = name || memberName || user?.name || 'Verified User';
    const finalEmail = (email || memberEmail || user?.email || '').toLowerCase().trim();
    const finalPhone = phone || memberPhone || user?.phone || 'Not Provided';
    const finalMessage = message || description;

    if (!finalName || !finalMessage) {
      throw new Error('Name and grievance description are required');
    }

    // Collect all attachment URLs
    let allAttachments = Array.isArray(attachments) ? attachments.filter(Boolean) : [];
    if (attachment && !allAttachments.includes(attachment)) allAttachments.push(attachment);
    if (imageUrl && !allAttachments.includes(imageUrl)) allAttachments.push(imageUrl);
    if (videoUrl && !allAttachments.includes(videoUrl)) allAttachments.push(videoUrl);

    const ticketNumber = `GRV-2026-${Date.now().toString().slice(-5)}`;
    return grievanceRepository.create({
      ticketNumber,
      user: user?.id || user?._id || null,
      name: finalName,
      memberName: finalName,
      email: finalEmail || '',
      memberEmail: finalEmail || '',
      phone: finalPhone || '',
      memberPhone: finalPhone || '',
      memberId: memberId || '',
      subject: subject || 'Public Grievance / Assistance Request',
      message: finalMessage,
      description: finalMessage,
      imageUrl: imageUrl || '',
      videoUrl: videoUrl || '',
      attachment: allAttachments[0] || '',
      attachments: allAttachments,
      status: 'pending'
    });
  }

  async getGrievances(query = {}) {
    return grievanceRepository.find(query);
  }

  async updateGrievance(id, updateData, adminUser) {
    const grievance = await grievanceRepository.findById(id);
    if (!grievance) throw new Error('Grievance not found');

    const { status, resolutionNotes, adminAnswer, adminRemarks, resolution } = updateData;
    const finalAnswer = adminAnswer || adminRemarks || resolution || resolutionNotes;

    if (status) {
      const normalizedStatus = status.toLowerCase().replace(/ /g, '_');
      if (['pending', 'in_progress', 'resolved', 'closed'].includes(normalizedStatus)) {
        grievance.status = normalizedStatus;
      } else {
        grievance.status = status;
      }
    }

    if (finalAnswer) {
      grievance.adminAnswer = finalAnswer;
      grievance.resolutionNotes = finalAnswer;
      grievance.adminAnsweredAt = new Date();
    }

    grievance.resolvedBy = adminUser?.name || 'Grievance Redressal Officer';
    if (status === 'resolved' || status === 'closed') {
      grievance.resolvedAt = new Date();
    }

    await grievance.save();
    return grievance;
  }

  async deleteGrievance(id) {
    const grv = await grievanceRepository.findById(id);
    if (!grv) throw new Error('Grievance not found');
    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(grv);
    return grievanceRepository.deleteById(id);
  }
}

module.exports = new GrievanceService();
