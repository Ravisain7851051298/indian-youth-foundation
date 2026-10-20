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
    bio: 'Leading youth empowerment, child literacy, and social reform movements for over 15 years with Yuva Kranti Dal.',
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

const SEED_SERVICES = [
  {
    title: 'Shiksha Kranti - Free Slum & Rural Education',
    category: 'Education & Child Welfare',
    description: 'Providing free foundational primary education, digital learning labs, stationery kits, and school uniforms for underprivileged slum and village children.',
    features: [
      'Daily 2-Hour Evening Remedial Classes',
      'Free School Bags, Notebooks & Stationery Kits',
      'Basic Computer Literacy & Math Workshops',
      'Nutrition & Regular Health Checkup Camps'
    ],
    icon: 'FiBookOpen',
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80',
    order: 1,
    status: 'Active'
  },
  {
    title: '24x7 Emergency Blood Donation & Helpline',
    category: 'Healthcare & Emergency Relief',
    description: 'Pan-India volunteer network connecting critically ill patients, accident victims, and thalassemia patients with verified local donors within 30 minutes.',
    features: [
      'Network of 10,000+ Verified Voluntary Blood Donors',
      '24/7 Dedicated Emergency WhatsApp & Call Desk',
      'Zero-Cost Direct Donor-Recipient Coordination',
      'Quarterly Mega Donation Drives with Civil Hospitals'
    ],
    icon: 'FiActivity',
    image: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&auto=format&fit=crop&q=80',
    order: 2,
    status: 'Active'
  },
  {
    title: 'Kaushal Vikas - Youth Skill & Career Mentorship',
    category: 'Youth Livelihood & Careers',
    description: 'Empowering unemployed youth and college students from lower-income backgrounds with market-ready IT, communication, and vocational skills.',
    features: [
      'Industry-Standard Digital Marketing & IT Modules',
      'Spoken English & Professional Interview Preparation',
      'Direct Corporate Internship & Job Placement Drives',
      '1-on-1 Mentorship Sessions with Industry Leaders'
    ],
    icon: 'FiBriefcase',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    order: 3,
    status: 'Active'
  },
  {
    title: 'Nari Samarthya - Women Vocational Self-Reliance Hub',
    category: 'Women Empowerment',
    description: 'Supporting marginalized women and homemakers through skill-based tailoring, handicrafts, organic food packing, and micro-entrepreneurship guidance.',
    features: [
      'Free Sewing, Embroidery & Textile Craft Labs',
      'Micro-finance & Self Help Group (SHG) Setup',
      'Marketplace Exhibitions for Selling Handcrafted Goods',
      'Legal Rights & Domestic Grievance Counseling'
    ],
    icon: 'FiHeart',
    image: 'https://images.unsplash.com/photo-1594708767771-a7502209ff51?w=800&auto=format&fit=crop&q=80',
    order: 4,
    status: 'Active'
  },
  {
    title: 'Aapda Mitra - Rapid Disaster Relief & Food Distribution',
    category: 'Disaster Relief & Food Security',
    description: 'Immediate humanitarian crisis response providing freshly cooked meals, dry rations, clean drinking water, winter blankets, and temporary shelters.',
    features: [
      'Trained First-Responder Emergency Volunteer Teams',
      'Annapurna Mobile Kitchen for Hot Meal Distribution',
      'Sanitation, Water Purification & First-Aid Supplies',
      'Post-Crisis Rehabilitation & School Reconstruction'
    ],
    icon: 'FiShield',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    order: 5,
    status: 'Active'
  },
  {
    title: 'Harit Bharat - Tree Plantation & Clean Water Mission',
    category: 'Environment & Sanitation',
    description: 'Fostering ecological sustainability through geotagged mass tree plantations, urban cleanliness drives, pond rejuvenation, and solar awareness.',
    features: [
      'Over 50,000+ Native Trees Planted Annually',
      'Plastic-Free School & Public Market Awareness',
      'Community Rainwater Harvesting & Pond Desilting',
      'Solar Clean Energy & Eco-Friendly Village Camps'
    ],
    icon: 'FiCheckCircle',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
    order: 6,
    status: 'Active'
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

    // Auto-seed real defaults for services if collection is currently empty
    if (resourceName === 'services' || resourceName === 'service') {
      try {
        const count = await Model.countDocuments();
        if (count === 0) {
          await Model.insertMany(SEED_SERVICES);
        }
      } catch (seedErr) {
        console.warn('Services seeding notice:', seedErr.message);
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
    const body = { ...req.body };
    if (typeof body.features === 'string') {
      body.features = body.features.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    }
    const item = new Model(body);
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
    const body = { ...req.body };
    if (typeof body.features === 'string') {
      body.features = body.features.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    }
    const item = await Model.findByIdAndUpdate(req.params.id, body, { returnDocument: 'after', runValidators: true });
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
