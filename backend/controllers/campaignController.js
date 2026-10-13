const campaignService = require('../services/campaignService');

const getCampaigns = async (req, res) => {
  try {
    const { status, category } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;

    const campaigns = await campaignService.getCampaigns(query);
    return res.json({ success: true, campaigns, total: campaigns.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createCampaign = async (req, res) => {
  try {
    const campaign = await campaignService.createCampaign(req.body);
    return res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      campaign
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await campaignService.updateCampaign(id, req.body);
    return res.json({
      success: true,
      message: 'Campaign updated successfully',
      campaign
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    await campaignService.deleteCampaign(id);
    return res.json({
      success: true,
      message: 'Campaign deleted successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign
};
