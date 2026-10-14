const grievanceRepository = require('../repositories/grievanceRepository');

class GrievanceService {
  async submitGrievance(data, user) {
    const { name, email, phone, subject, message } = data;
    if (!name || !email || !message) {
      throw new Error('Name, email, and complaint message are required');
    }

    const ticketNumber = `GRV-2026-${Date.now().toString().slice(-5)}`;
    return grievanceRepository.create({
      ticketNumber,
      user: user?.id || null,
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Grievance',
      message,
      status: 'pending'
    });
  }

  async getGrievances(query = {}) {
    return grievanceRepository.find(query);
  }

  async updateGrievance(id, updateData, adminUser) {
    const grievance = await grievanceRepository.findById(id);
    if (!grievance) throw new Error('Grievance not found');

    const { status, resolutionNotes } = updateData;
    if (status) grievance.status = status;
    if (resolutionNotes) grievance.resolutionNotes = resolutionNotes;
    grievance.resolvedBy = adminUser.name || 'Grievance Redressal Officer';
    if (status === 'resolved') grievance.resolvedAt = new Date();

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
