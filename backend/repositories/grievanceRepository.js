const Grievance = require('../models/Grievance');

class GrievanceRepository {
  async create(data) {
    const grievance = new Grievance(data);
    return grievance.save();
  }

  async findById(id) {
    return Grievance.findById(id);
  }

  async find(query = {}, sort = { createdAt: -1 }) {
    return Grievance.find(query).sort(sort);
  }

  async updateById(id, data) {
    return Grievance.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  }

  async count(query = {}) {
    return Grievance.countDocuments(query);
  }

  async deleteById(id) {
    return Grievance.findByIdAndDelete(id);
  }
}

module.exports = new GrievanceRepository();
