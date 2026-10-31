const mongoose = require('mongoose');
const User = require('../models/User');

class UserRepository {
  async findById(id) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;
    return User.findById(id);
  }

  async findByEmail(email) {
    if (!email) return null;
    return User.findOne({ email: email.toLowerCase().trim() });
  }

  async findByPhone(phone) {
    if (!phone) return null;
    return User.findOne({ phone: phone.trim() });
  }

  async findByIdentifier(identifier) {
    const raw = (identifier || '').toString().trim();
    if (!raw) return null;

    const lower = raw.toLowerCase();
    const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`^${escaped}$`, 'i');
    const digits = raw.replace(/\D/g, '');

    const orConditions = [
      { email: lower },
      { phone: raw },
      { memberId: regex },
      { volunteerId: regex },
      { coordinatorId: regex }
    ];

    if (digits.length >= 10) {
      orConditions.push({ phone: new RegExp(`${digits}$`) });
    }

    if (mongoose.Types.ObjectId.isValid(raw)) {
      orConditions.push({ _id: raw });
    }

    return User.findOne({ $or: orConditions });
  }

  async findByEmailOrPhone(identifier) {
    return this.findByIdentifier(identifier);
  }

  async findByResetToken(token) {
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
  }

  async findByMemberId(memberId) {
    return User.findOne({ memberId });
  }

  async findByVolunteerId(volunteerId) {
    return User.findOne({ $or: [{ volunteerId }, { memberId: volunteerId }] });
  }

  async find(query = {}, sort = { createdAt: -1 }) {
    return User.find(query).select('-password').sort(sort);
  }

  async count(query = {}) {
    return User.countDocuments(query);
  }

  async create(userData) {
    if (!userData.email || (typeof userData.email === 'string' && !userData.email.trim())) {
      delete userData.email;
    }
    const user = new User(userData);
    return user.save();
  }

  async updateById(id, updateData) {
    return User.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
  }

  async deleteById(id) {
    return User.findByIdAndDelete(id);
  }
}

module.exports = new UserRepository();
