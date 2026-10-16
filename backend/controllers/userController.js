const User = require('../models/User');
const UserAward = require('../models/UserAward');

const getUsers = async (req, res) => {
  try {
    const { role, status, search, q } = req.query;
    const query = {};

    if (role && role !== 'All') {
      if (role === 'Member') {
        query.$or = [{ role: 'Member' }, { isMember: true }];
      } else if (role === 'Volunteer') {
        query.$or = [{ role: 'Volunteer' }, { isVolunteer: true }];
      } else {
        query.role = role;
      }
    }

    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    const searchTerm = (search || q || '').trim();
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      const searchConditions = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { memberId: regex },
        { volunteerId: regex },
        { district: regex },
        { state: regex }
      ];
      if (query.$or) {
        query.$and = [{ $or: query.$or }, { $or: searchConditions }];
        delete query.$or;
      } else {
        query.$or = searchConditions;
      }
    }

    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 });

    return res.json({ success: true, users, data: users, total: users.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const awards = await UserAward.find({ userId: id }).sort({ awardedAt: -1 });

    return res.json({ success: true, user, awards });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const allowedStatuses = ['active', 'blocked', 'deactivated', 'pending'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`
      });
    }

    // Safety check: protect current admin from blocking self
    if (req.user && req.user.id === id && status === 'blocked') {
      return res.status(400).json({
        success: false,
        message: 'You cannot block your own administrative account.'
      });
    }

    const updateData = { status };
    if (notes !== undefined) updateData.notes = notes;

    const user = await User.findByIdAndUpdate(id, updateData, { returnDocument: 'after' }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      message: `Account status for ${user.name} changed to '${status}'.`,
      user
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Safety check: protect current admin from deleting self
    if (req.user && req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own administrative account.'
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Also clean up any awards or orphaned data if necessary
    await UserAward.deleteMany({ userId: id });

    return res.json({
      success: true,
      message: `User account for ${user.name} (${user.email}) permanently deleted.`,
      id
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const blockedUsers = await User.countDocuments({ status: 'blocked' });
    const members = await User.countDocuments({ $or: [{ role: 'Member' }, { isMember: true }] });
    const volunteers = await User.countDocuments({ $or: [{ role: 'Volunteer' }, { isVolunteer: true }] });
    const donors = await User.countDocuments({ role: 'Donor' });

    return res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        blockedUsers,
        members,
        volunteers,
        donors
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  getUserStats
};
