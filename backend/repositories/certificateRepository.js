const Certificate = require('../models/Certificate');

class CertificateRepository {
  async create(data) {
    const cert = new Certificate(data);
    return cert.save();
  }

  async findById(id) {
    return Certificate.findById(id).populate('recipient');
  }

  async findByCertificateId(certificateId) {
    return Certificate.findOne({ certificateId }).populate('recipient');
  }

  async findCertsWithPrefix(prefix) {
    return Certificate.find({ certificateId: new RegExp(`^${prefix}`) })
      .select('certificateId')
      .lean();
  }

  async find(query = {}, sort = { createdAt: -1 }) {
    return Certificate.find(query).populate('recipient').sort(sort);
  }

  async count(query = {}) {
    return Certificate.countDocuments(query);
  }

  async deleteById(id) {
    return Certificate.findByIdAndDelete(id);
  }
}

module.exports = new CertificateRepository();
