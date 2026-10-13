const planRepository = require('../repositories/planRepository');

class PlanService {
  async getPlans() {
    return planRepository.find();
  }

  async createPlan(planData) {
    const { title, titleHi, price, validityMonths, benefits, benefitsHi, isPopular } = planData;
    if (!title || price === undefined) {
      throw new Error('Plan title and price are required');
    }
    return planRepository.create({
      title,
      titleHi: titleHi || title,
      price: Number(price),
      validityMonths: validityMonths || 12,
      benefits: Array.isArray(benefits) ? benefits : [benefits || 'Official Membership ID Card'],
      benefitsHi: Array.isArray(benefitsHi) ? benefitsHi : [benefitsHi || 'आधिकारिक सदस्यता पहचान पत्र'],
      isPopular: isPopular || false
    });
  }

  async updatePlan(id, planData) {
    const plan = await planRepository.updateById(id, planData);
    if (!plan) throw new Error('Plan not found');
    return plan;
  }

  async deletePlan(id) {
    const plan = await planRepository.deleteById(id);
    if (!plan) throw new Error('Plan not found');
    return plan;
  }
}

module.exports = new PlanService();
