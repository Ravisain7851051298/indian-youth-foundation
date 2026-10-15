const User = require('../models/User');

class UserRepository {
  async findById(id) {
    return User.findById(id);
  }

  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase().trim() });
  }

  async findByPhone(phone) {
    return User.findOne({ phone: phone.trim() });
  }

  async findByEmailOrPhone(identifier) {
    return User.findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { phone: identifier.trim() }
      ]
    });
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
