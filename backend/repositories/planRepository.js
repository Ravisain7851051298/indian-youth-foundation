const MembershipPlan = require('../models/MembershipPlan');

class PlanRepository {
  async create(data) {
    const plan = new MembershipPlan(data);
    return plan.save();
  }

  async findById(id) {
    return MembershipPlan.findById(id);
  }

  async find(query = {}, sort = { price: 1 }) {
    return MembershipPlan.find(query).sort(sort);
  }

  async updateById(id, data) {
    return MembershipPlan.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  }

  async deleteById(id) {
    return MembershipPlan.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return MembershipPlan.countDocuments(query);
  }
}

module.exports = new PlanRepository();
