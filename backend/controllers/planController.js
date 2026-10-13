const planService = require('../services/planService');

const getPlans = async (req, res) => {
  try {
    const plans = await planService.getPlans();
    return res.json({ success: true, plans, total: plans.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createPlan = async (req, res) => {
  try {
    const plan = await planService.createPlan(req.body);
    return res.status(201).json({
      success: true,
      message: 'Membership plan created successfully',
      plan
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await planService.updatePlan(id, req.body);
    return res.json({
      success: true,
      message: 'Membership plan updated successfully',
      plan
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    await planService.deletePlan(id);
    return res.json({
      success: true,
      message: 'Membership plan removed successfully',
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan
};
