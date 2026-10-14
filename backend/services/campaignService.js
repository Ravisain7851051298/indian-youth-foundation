const campaignRepository = require('../repositories/campaignRepository');

class CampaignService {
  async getCampaigns(query = {}) {
    return campaignRepository.find(query);
  }

  async createCampaign(data) {
    if (!data.title || !data.goalAmount) {
      throw new Error('Title and goal amount are required');
    }
    return campaignRepository.create(data);
  }

  async updateCampaign(id, data) {
    const campaign = await campaignRepository.updateById(id, data);
    if (!campaign) throw new Error('Campaign not found');
    return campaign;
  }

  async deleteCampaign(id) {
    const campaign = await campaignRepository.deleteById(id);
    if (!campaign) throw new Error('Campaign not found');
    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(campaign);
    return campaign;
  }
}

module.exports = new CampaignService();
