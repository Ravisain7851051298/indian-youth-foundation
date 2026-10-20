const Award = require('../models/Award');
const UserAward = require('../models/UserAward');
const User = require('../models/User');

const DEFAULT_AWARDS = [
  {
    title: 'Star Volunteer Award',
    description: 'Awarded for exceptional commitment and selfless hours dedicated to grassroots social service.',
    badgeIcon: 'FiStar',
    badgeColor: 'gold',
    category: 'Volunteerism',
    tier: 'Gold',
    points: 150
  },
  {
    title: 'Yuva Kranti Ratna',
    description: 'The highest honor of Yuva Kranti Dal for transformative leadership and national contribution.',
    badgeIcon: 'FiAward',
    badgeColor: 'red',
    category: 'Social Service',
    tier: 'Special Honor',
    points: 500
  },
  {
    title: 'Community Champion',
    description: 'Recognizing steadfast dedication to local slum empowerment, ration drives, and winter relief.',
    badgeIcon: 'FiShield',
    badgeColor: 'emerald',
    category: 'Community Aid',
    tier: 'Platinum',
    points: 250
  },
  {
    title: 'Healthcare & Blood Hero',
    description: 'Awarded for organizing life-saving voluntary blood donation networks and emergency patient support.',
    badgeIcon: 'FiHeart',
    badgeColor: 'red',
    category: 'Emergency Relief',
    tier: 'Gold',
    points: 200
  },
  {
    title: 'Child Literacy Crusader',
    description: 'Commending outstanding effort in establishing free slum study pods and distributing school kits.',
    badgeIcon: 'FiZap',
    badgeColor: 'blue',
    category: 'Child Education',
    tier: 'Silver',
    points: 120
  },
  {
    title: 'Inspiring Changemaker',
    description: 'Honoring youth mobilization and creative leadership in nation-building initiatives.',
    badgeIcon: 'FiAward',
    badgeColor: 'purple',
    category: 'Youth Leadership',
    tier: 'Gold',
    points: 180
  }
];

// Seed default awards if collection is empty
const seedDefaultAwardsIfEmpty = async () => {
  try {
    const count = await Award.countDocuments();
    if (count === 0) {
      await Award.insertMany(DEFAULT_AWARDS);
    }
  } catch (e) {
    console.error('Failed to seed default awards:', e);
  }
};

// ----------------- AWARD TEMPLATES -----------------

const getAwards = async (req, res) => {
  try {
    await seedDefaultAwardsIfEmpty();
    const awards = await Award.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({ success: true, awards, data: awards, total: awards.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createAward = async (req, res) => {
  try {
    const { title, description, badgeIcon, badgeColor, badgeImage, category, tier, points } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Award title is required' });
    }

    const award = new Award({
      title,
      description: description || '',
      badgeIcon: badgeIcon || 'FiAward',
      badgeColor: badgeColor || 'gold',
      badgeImage: badgeImage || '',
      category: category || 'Social Service',
      tier: tier || 'Gold',
      points: Number(points) || 100
    });

    await award.save();
    return res.status(201).json({ success: true, message: 'Award badge created successfully', award });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateAward = async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Award.findByIdAndUpdate(id, req.body, { returnDocument: 'after' });
    if (!award) {
      return res.status(404).json({ success: false, message: 'Award template not found' });
    }
    return res.json({ success: true, message: 'Award badge updated successfully', award });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteAward = async (req, res) => {
  try {
    const { id } = req.params;
    const award = await Award.findByIdAndDelete(id);
    if (!award) {
      return res.status(404).json({ success: false, message: 'Award template not found' });
    }
    return res.json({ success: true, message: 'Award badge deleted successfully' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ----------------- USER AWARD GRANTS -----------------

const getAllGrantedAwards = async (req, res) => {
  try {
    const { role, search, q } = req.query;
    const query = {};
    if (role && role !== 'All') {
      query.userRole = new RegExp(`^${role}$`, 'i');
    }
    const term = (search || q || '').trim();
    if (term) {
      const regex = new RegExp(term, 'i');
      query.$or = [
        { userName: regex },
        { userEmail: regex },
        { title: regex },
        { reason: regex },
        { badgeNumber: regex }
      ];
    }

    const grants = await UserAward.find(query)
      .sort({ awardedAt: -1, createdAt: -1 })
      .populate('userId', 'name email phone role photoUrl memberId volunteerId status');

    return res.json({ success: true, grants, data: grants, total: grants.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const grantAwardToUser = async (req, res) => {
  try {
    const { userId, awardId, title, reason, citation, tier, category, badgeColor, badgeIcon, badgeImage } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Recipient user ID is required' });
    }
    if (!reason || !reason.trim()) {
      return res.status(400).json({ success: false, message: 'Citation / Reason for the award is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in database' });
    }

    let awardTemplate = null;
    if (awardId) {
      awardTemplate = await Award.findById(awardId);
    }

    const userAward = new UserAward({
      userId: user._id,
      awardId: awardTemplate?._id || null,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      userPhoto: user.photoUrl || '',
      title: title || awardTemplate?.title || 'Excellence Award',
      description: awardTemplate?.description || '',
      badgeIcon: badgeIcon || awardTemplate?.badgeIcon || 'FiAward',
      badgeColor: badgeColor || awardTemplate?.badgeColor || 'gold',
      badgeImage: badgeImage || awardTemplate?.badgeImage || '',
      category: category || awardTemplate?.category || 'Social Service',
      tier: tier || awardTemplate?.tier || 'Gold',
      reason: reason.trim(),
      citation: citation || reason.trim(),
      awardedAt: new Date(),
      awardedBy: req.user?.id || null,
      awardedByName: req.user?.name || 'National Trustee Board'
    });

    await userAward.save();
    return res.status(201).json({
      success: true,
      message: `Award '${userAward.title}' successfully presented to ${user.name}!`,
      userAward
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const revokeUserAward = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UserAward.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Award record not found' });
    }
    return res.json({ success: true, message: 'Award badge revoked successfully' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getMyAwards = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const awards = await UserAward.find({ userId }).sort({ awardedAt: -1, createdAt: -1 });
    return res.json({ success: true, awards, total: awards.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUserAwardsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const awards = await UserAward.find({ userId }).sort({ awardedAt: -1, createdAt: -1 });
    return res.json({ success: true, awards, total: awards.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAwards,
  createAward,
  updateAward,
  deleteAward,
  getAllGrantedAwards,
  grantAwardToUser,
  revokeUserAward,
  getMyAwards,
  getUserAwardsByUserId
};
