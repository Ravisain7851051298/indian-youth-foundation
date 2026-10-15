const Campaign = require('../models/Campaign');

class CampaignRepository {
  async create(data) {
    const campaign = new Campaign(data);
    return campaign.save();
  }

  async findById(id) {
    return Campaign.findById(id);
  }

  async find(query = {}, sort = { createdAt: -1 }) {
    return Campaign.find(query).sort(sort);
  }

  async updateById(id, data) {
    return Campaign.findByIdAndUpdate(id, data, { returnDocument: 'after' });
  }

  async deleteById(id) {
    return Campaign.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return Campaign.countDocuments(query);
  }
}

module.exports = new CampaignRepository();
