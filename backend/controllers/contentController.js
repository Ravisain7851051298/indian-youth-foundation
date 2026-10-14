const Service = require('../models/Service');
const Program = require('../models/Program');
const Story = require('../models/Story');
const Feedback = require('../models/Feedback');
const TeamMember = require('../models/TeamMember');
const MissionVision = require('../models/MissionVision');

const modelMap = {
  services: Service,
  service: Service,
  programs: Program,
  program: Program,
  stories: Story,
  story: Story,
  feedback: Feedback,
  feedbacks: Feedback,
  reviews: Feedback,
  'team-members': TeamMember,
  team: TeamMember,
  'mission-vision': MissionVision,
  missionVision: MissionVision
};

const getModel = (resourceName) => {
  const model = modelMap[resourceName.toLowerCase()];
  if (!model) throw new Error(`Unknown content resource: ${resourceName}`);
  return model;
};

// Generic CRUD Handlers
const getAll = (resourceName) => async (req, res) => {
  try {
    const Model = getModel(resourceName);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.type) filter.type = req.query.type;

    const items = await Model.find(filter).sort({ order: 1, createdAt: -1 });
    return res.json({
      success: true,
      data: items,
      items,
      total: items.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getById = (resourceName) => async (req, res) => {
  try {
    const Model = getModel(resourceName);
    const item = await Model.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    return res.json({ success: true, data: item, item });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createItem = (resourceName) => async (req, res) => {
  try {
    const Model = getModel(resourceName);
    const item = new Model(req.body);
    await item.save();
    return res.status(201).json({
      success: true,
      message: `${resourceName} created successfully`,
      data: item,
      item
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateItem = (resourceName) => async (req, res) => {
  try {
    const Model = getModel(resourceName);
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    return res.json({
      success: true,
      message: `${resourceName} updated successfully`,
      data: item,
      item
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteItem = (resourceName) => async (req, res) => {
  try {
    const Model = getModel(resourceName);
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(item);
    return res.json({
      success: true,
      message: `${resourceName} and associated files deleted successfully`,
      id: req.params.id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAll,
  getById,
  createItem,
  updateItem,
  deleteItem
};
