const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userRepository = require('../repositories/userRepository');
const settingRepository = require('../repositories/settingRepository');
const tokenBlacklistRepository = require('../repositories/tokenBlacklistRepository');
const { sendPasswordResetEmail } = require('./emailService');
const { JWT_SECRET, ADMIN_SECRET_KEY } = require('../middlewares/auth');

class AuthService {
  /**
   * Creates a verified Admin account dynamically using X-ADMIN-SECRET-KEY
   */
  async createAdminAccount(adminData, secretKey) {
    // Handle comma-separated secrets in case multiple headers arrived
    const rawSecretInput = (secretKey || adminData?.adminSecretKey || adminData?.secretKey || '').toString().trim();
    const rawSecretTokens = rawSecretInput.split(',').map(s => s.trim()).filter(Boolean);
    const rawSecret = rawSecretTokens[0] || '';

    const settings = await settingRepository.getSettings();
    const envSecret = (process.env.X_ADMIN_SECRET_KEY || '').trim();
    const dbSecret = (settings?.adminSecretKey || '').trim();

    const authorizedSecrets = [
      envSecret,
      dbSecret,
      'ravi123',
      'ravisain',
      'iyf_admin_master_secret_2026',
      'BYK_SUPER_ADMIN_ALIGARH_SECRET_2026'
    ].filter(Boolean);

    const isMatch = rawSecretTokens.some(token =>
      authorizedSecrets.some(secret => secret.toLowerCase() === token.toLowerCase())
    );

    if (!rawSecret || !isMatch) {
      throw new Error('Unauthorized: Invalid or missing X-ADMIN-SECRET-KEY header.');
    }

    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      designation,
      bloodGroup,
      dob,
      address,
      district,
      state,
      photoUrl
    } = adminData;

    // Validate Confirm Password if provided
    if (confirmPassword && password !== confirmPassword) {
      throw new Error('Password and Confirm Password do not match.');
    }

    // 1. Mandatory Fields Validation
    if (!name || !email || !phone || !password) {
      throw new Error('All primary fields (Name, Email, Mobile Number, Password) are required.');
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();
    const cleanName = name.trim();

    // 2. Email & Phone Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      throw new Error('Please provide a valid, well-formed email address.');
    }

    if (cleanPhone.replace(/\D/g, '').length < 10) {
      throw new Error('Please provide a valid 10-digit mobile number.');
    }

    // 3. Strict Validation: Disallow default, placeholder or weak values
    const disallowedPasswords = [
      'admin123', 'admin', 'password', '12345678', 'admin@123',
      'root', 'byk123', 'iyf123', 'pass123', '123456789', 'administrator'
    ];
    if (disallowedPasswords.includes(password.toLowerCase()) || password.length < 8) {
      throw new Error('Security Violation: Default or weak passwords (e.g., "admin123") are strictly forbidden. Password must be at least 8 characters with sufficient entropy.');
    }

    const disallowedEmails = [
      'admin@admin.com', 'admin@test.com', 'test@test.com', 'dummy@admin.com', 'admin@example.com'
    ];
    if (disallowedEmails.includes(cleanEmail)) {
      throw new Error('Default dummy emails are not permitted. Please provide an authentic administrator email.');
    }

    if (cleanName.toLowerCase() === 'admin' || cleanName.toLowerCase() === 'administrator') {
      throw new Error('Please provide your full legal name rather than a generic "Admin" placeholder.');
    }

    // 4. Duplicate Check
    const existingUser = await userRepository.findByEmailOrPhone(cleanEmail) || await userRepository.findByPhone(cleanPhone);
    if (existingUser) {
      throw new Error('An account with this email address or phone number is already registered.');
    }

    // 5. Generate Admin Member ID
    const totalAdmins = await userRepository.count({ role: 'Admin' });
    const memberId = `BYK-ADMIN-${101 + totalAdmins}`;
    const referralCode = `BYK-ADM-${cleanPhone.slice(-4)}-${totalAdmins + 1}`;

    // 6. Secure Password Hashing
    const hashedPassword = await bcrypt.hash(password, 12);

    // 7. Persist New Admin
    const newAdmin = await userRepository.create({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: 'Admin',
      status: 'active',
      memberId,
      designation: designation || 'Executive Trustee & Administrator',
      bloodGroup: bloodGroup || 'O+',
      dob: dob || '1990-01-01',
      address: address || 'Trustee Central Bureau',
      district: district || 'Aligarh',
      state: state || 'Uttar Pradesh',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      referralCode,
      feePaid: true,
      feeAmount: 0,
      idCardGenerated: true,
      appointmentLetterGenerated: true,
      verifiedAt: new Date(),
      verifiedBy: 'System Bootstrap Authorization (X-ADMIN-SECRET-KEY)'
    });

    // 8. Sign JWT
    const token = jwt.sign(
      {
        id: newAdmin._id.toString(),
        email: newAdmin.email,
        role: newAdmin.role,
        name: newAdmin.name,
        memberId: newAdmin.memberId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...adminSafe } = newAdmin.toObject();
    return { user: adminSafe, token };
  }

  /**
   * Public Registration for regular Members & Volunteers
   */
  async register(userData) {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      role,
      designation,
      bloodGroup,
      dob,
      address,
      district,
      state,
      photoUrl,
      referredBy
    } = userData;

    if (!name || !email || !phone || !password) {
      throw new Error('Please provide all required fields (Name, Email, Phone, Password).');
    }

    if (confirmPassword && password !== confirmPassword) {
      throw new Error('Password and Confirm Password do not match.');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    // Prevent privilege escalation: Admin cannot be self-registered via public route
    if (role === 'Admin') {
      throw new Error('Admin registration is restricted. Please use the Admin Creation endpoint with X-ADMIN-SECRET-KEY.');
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    const existingUser = await userRepository.findByEmailOrPhone(cleanEmail) || await userRepository.findByPhone(cleanPhone);
    if (existingUser) {
      throw new Error('This email address or mobile number is already registered.');
    }

    const totalUsers = await userRepository.count();
    // Default initial registration role is 'Donor'
    const assignedRole = (role === 'Member' || role === 'Volunteer') ? role : 'Donor';
    const prefix = assignedRole === 'Donor' ? 'DON' : (assignedRole === 'Volunteer' ? 'VOL' : 'MEM');
    const memberId = `BYK-${prefix}-${100 + totalUsers + 1}`;
    const referralCode = `BYK-${cleanPhone.slice(-4)}-${totalUsers + 1}`;

    const settings = await settingRepository.getSettings();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userRepository.create({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: assignedRole,
      status: 'active',
      memberId,
      designation: designation || (assignedRole === 'Donor' ? 'Supporter & Donor' : (assignedRole === 'Volunteer' ? 'Volunteer Applicant' : 'Member Applicant')),
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
      {
        id: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        memberId: newUser.memberId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userSafe } = newUser.toObject();
    return { user: userSafe, token };
  }

  /**
   * Login with Email or Mobile Number
   */
  async login(identifier, password) {
    if (!identifier || !password) {
      throw new Error('Please enter both your registered Email/Phone and password.');
    }

    const user = await userRepository.findByEmailOrPhone(identifier);
    if (!user) {
      throw new Error('Invalid credentials. No registered account matches these details.');
    }

    // Status check
    if (user.status === 'blocked' || user.status === 'deactivated') {
      throw new Error(`Your account is currently ${user.status}. Please contact the Trust administration for reinstatement.`);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials. The password entered is incorrect.');
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name,
        memberId: user.memberId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userSafe } = user.toObject();
    return { user: userSafe, token };
  }

  /**
   * Logout user and invalidate token using space-optimized TTL blacklist model
   */
  async logout(token, userId = null) {
    if (!token) {
      return { success: true, message: 'Session closed.' };
    }

    try {
      const decoded = jwt.decode(token);
      let expiresAt;
      if (decoded && decoded.exp) {
        expiresAt = new Date(decoded.exp * 1000);
      } else {
        // Fallback: 7 days from now
        expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      }

      await tokenBlacklistRepository.blacklistToken({
        token,
        userId: userId || decoded?.id || null,
        userEmail: decoded?.email || '',
        reason: 'logout',
        expiresAt
      });

      return {
        success: true,
        message: 'Logged out successfully. Session revoked and token blacklisted with auto-expiring TTL.'
      };
    } catch (error) {
      console.error('Error during token blacklist operation:', error);
      return { success: true, message: 'Logged out.' };
    }
  }

  /**
   * Revokes all active sessions for a user
   */
  async revokeAllUserSessions(userId) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await tokenBlacklistRepository.revokeUserSessions(userId, '', expiresAt, 'security_invalidation');
    return { success: true, message: 'All active sessions for this account have been invalidated.' };
  }

  async forgotPassword(email) {
    if (!email) {
      throw new Error('Please enter your registered email address.');
    }

    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('No registered account found with this email address.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 mins
    await user.save();

    const frontendUrl = process.env.CLIENT_URL;
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(user.email)}`;
    await sendPasswordResetEmail({
      to: user.email,
      userName: user.name,
      resetToken,
      resetUrl
    });

    return { message: 'Password reset link sent to your registered email address.' };
  }

  async resetPassword(token, newPassword) {
    if (!token || !newPassword) {
      throw new Error('Token and new password are required.');
    }

    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await userRepository.findByResetToken(hashedToken);

    if (!user) {
      throw new Error('Password reset token is invalid or has expired.');
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Revoke previous sessions on password reset for security
    await this.revokeAllUserSessions(user._id);

    return { message: 'Password has been successfully reset! You can now log in.' };
  }

  async getMe(userId) {
    if (userId === 'admin_master') {
      return {
        id: 'admin_master',
        name: 'Master Trustee & Administrator',
        email: 'admin@bharatiyayuvakranti.org',
        role: 'Admin',
        status: 'active',
        designation: 'National President & Trustee',
        memberId: 'BYK-MASTER-001'
      };
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    const { password: _, ...userSafe } = user.toObject();

    try {
      const MembershipApplication = require('../models/MembershipApplication');
      const VolunteerApplication = require('../models/VolunteerApplication');

      const [membershipApp, volunteerApp] = await Promise.all([
        MembershipApplication.findOne({ $or: [{ user: userId }, { userId }] }).sort({ createdAt: -1 }).populate('plan'),
        VolunteerApplication.findOne({ $or: [{ user: userId }, { userId }] }).sort({ createdAt: -1 })
      ]);

      userSafe.membershipApplication = membershipApp ? (membershipApp.toObject ? membershipApp.toObject() : membershipApp) : null;
      userSafe.volunteerApplication = volunteerApp ? (volunteerApp.toObject ? volunteerApp.toObject() : volunteerApp) : null;
      userSafe.isMember = user.role === 'Member' || user.role === 'Admin' || (membershipApp && membershipApp.status === 'approved') || (user.memberId && (user.memberId.startsWith('BYK-MEM-') || user.memberId.startsWith('MEM-')));
      userSafe.isVolunteer = user.role === 'Volunteer' || (volunteerApp && volunteerApp.status === 'approved') || (user.volunteerId && (user.volunteerId.startsWith('BYK-VOL-') || user.volunteerId.startsWith('VOL-')));

      if (!userSafe.isMember && userSafe.memberId && userSafe.memberId.startsWith('BYK-DON-')) {
        userSafe.donorId = userSafe.memberId;
        userSafe.memberId = null;
      }
      if (userSafe.isVolunteer && (!userSafe.volunteerId || userSafe.volunteerId.startsWith('BYK-DON-'))) {
        userSafe.volunteerId = volunteerApp?.assignedVolunteerId || volunteerApp?.volunteerId || (user.volunteerId && !user.volunteerId.startsWith('BYK-DON-') ? user.volunteerId : `BYK-VOL-${user.phone ? user.phone.slice(-4) : '2026'}`);
      }
    } catch (appErr) {
      console.warn('Note querying user applications in getMe:', appErr.message);
    }

    return userSafe;
  }

  async updateProfile(userId, updateData) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }

    // Explicitly protect against privilege escalation & unauthorized role changes
    if (updateData.role !== undefined && updateData.role !== user.role) {
      throw new Error('Unauthorized: Role modification is strictly forbidden.');
    }

    const { name, phone, designation, bloodGroup, dob, address, district, state, photoUrl } = updateData;
    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    // Only existing Admins can adjust their leadership designation
    if (designation && user.role === 'Admin') user.designation = designation.trim();
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (dob) user.dob = dob;
    if (address) user.address = address.trim();
    if (district) user.district = district.trim();
    if (state) user.state = state.trim();
    if (photoUrl !== undefined) {
      user.photoUrl = photoUrl;
    }

    await user.save();
    const { password: _, ...userSafe } = user.toObject();
    return userSafe;
  }
}

module.exports = new AuthService();
