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

const SEED_TEAM_MEMBERS = [
  {
    name: 'Dr. Vikram Sharma',
    position: 'Founder & National President',
    department: 'Leadership & Board',
    phone: '+91 98765 43210',
    email: 'president@bharatiyayuvakranti.org',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    bio: 'Leading youth empowerment, child literacy, and social reform movements for over 15 years with Bharatiya Yuva Kranti.',
    status: 'active',
    order: 1
  },
  {
    name: 'Rajesh Kumar Verma',
    position: 'General Secretary & Executive Director',
    department: 'Leadership & Board',
    phone: '+91 98765 43211',
    email: 'team@bharatiyayuvakranti.org',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    bio: 'Head of state-wide grassroots operations, community field initiatives, and statutory execution across 12+ districts.',
    status: 'active',
    order: 2
  },
  {
    name: 'Ms. Rekha Choudhary',
    position: 'National Treasurer & Legal Compliance Head',
    department: 'Administration & Accounts',
    phone: '+91 98765 43213',
    email: 'treasurer@bharatiyayuvakranti.org',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    bio: 'Chartered accountant supervising Section 12A & 80G statutory financial audits, donor transparency, and CSR funds allocation.',
    status: 'active',
    order: 3
  },
  {
    name: 'Amit Patel',
    position: 'Director of Youth Mobilization',
    department: 'Youth Empowerment & Training',
    phone: '+91 98765 43214',
    email: 'youth@bharatiyayuvakranti.org',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    bio: 'Spearheading campus ambassador networks, skill development workshops, and youth leadership conclaves nationwide.',
    status: 'active',
    order: 4
  }
];

// Generic CRUD Handlers
const getAll = (resourceName) => async (req, res) => {
  try {
    const Model = getModel(resourceName);
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.type) filter.type = req.query.type;

    // Auto-seed real defaults for team-members if collection is currently empty
    if (resourceName === 'team-members' || resourceName === 'team') {
      try {
        const count = await Model.countDocuments();
        if (count === 0) {
          await Model.insertMany(SEED_TEAM_MEMBERS);
        }
      } catch (seedErr) {
        console.warn('Team members seeding notice:', seedErr.message);
      }
    }

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
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
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
