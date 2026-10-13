const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userRepository = require('../repositories/userRepository');
const settingRepository = require('../repositories/settingRepository');
const { sendPasswordResetEmail } = require('./emailService');
const { JWT_SECRET } = require('../middlewares/auth');

class AuthService {
  async register(userData) {
    const { name, email, phone, password, role, designation, bloodGroup, dob, address, district, state, photoUrl, referredBy } = userData;

    if (!name || !email || !phone || !password) {
      throw new Error('Please provide all required fields (Name, Email, Phone, Password)');
    }

    const existingUser = await userRepository.findByEmailOrPhone(email) || await userRepository.findByPhone(phone);
    if (existingUser) {
      throw new Error('This email or mobile number is already registered');
    }

    const totalUsers = await userRepository.count();
    const assignedRole = role === 'Volunteer' ? 'Volunteer' : 'Member';
    const prefix = assignedRole === 'Volunteer' ? 'VOL' : 'MEM';
    const memberId = `BYK-${prefix}-PENDING-${100 + totalUsers + 1}`;
    const referralCode = `BYK-${phone.slice(-4)}-${totalUsers + 1}`;

    const settings = await settingRepository.getSettings();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.create({
      name,
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role: assignedRole,
      status: 'pending',
      memberId,
      designation: designation || (assignedRole === 'Volunteer' ? 'Applicant (Volunteer Wing)' : 'Applicant (Registered Member)'),
      bloodGroup: bloodGroup || 'O+',
      dob: dob || '2000-01-01',
      address: address || '',
      district: district || 'Aligarh',
      state: state || 'Uttar Pradesh',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
      referralCode,
      referredBy: referredBy || null,
      feePaid: false,
      feeAmount: settings?.membershipFee || 250,
      idCardGenerated: false,
      appointmentLetterGenerated: false
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role, name: newUser.name, memberId: newUser.memberId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userSafe } = newUser.toObject();
    return { user: userSafe, token };
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error('Please enter email and password');
    }

    const user = await userRepository.findByEmailOrPhone(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name, memberId: user.memberId },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userSafe } = user.toObject();
    return { user: userSafe, token };
  }

  async forgotPassword(email) {
    if (!email) {
      throw new Error('Please enter your registered email address');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('No registered account found with this email address');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 mins
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
    await sendPasswordResetEmail(user, resetUrl);

    return { message: 'Password reset link sent to your registered email address!' };
  }

  async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      throw new Error('Token and new password are required');
    }

    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await userRepository.findByResetToken(hashedToken);

    if (!user) {
      throw new Error('Password reset token is invalid or has expired');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: 'Password has been successfully reset! You can now log in.' };
  }

  async getMe(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const { password: _, ...userSafe } = user.toObject();
    return userSafe;
  }

  async updateProfile(userId, updateData) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const { name, phone, designation, bloodGroup, dob, address, district, state, photoUrl } = updateData;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (designation && user.role === 'Admin') user.designation = designation;
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (dob) user.dob = dob;
    if (address) user.address = address;
    if (district) user.district = district;
    if (state) user.state = state;
    if (photoUrl) user.photoUrl = photoUrl;

    await user.save();
    const { password: _, ...userSafe } = user.toObject();
    return userSafe;
  }
}

module.exports = new AuthService();
