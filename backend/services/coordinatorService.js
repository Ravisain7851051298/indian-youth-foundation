const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const User = require('../models/User');
const MembershipApplication = require('../models/MembershipApplication');
const userRepository = require('../repositories/userRepository');
const planRepository = require('../repositories/planRepository');
const applicationService = require('./applicationService');
const { sendCoordinatorAppointmentEmail } = require('./emailService');

class CoordinatorService {
  /**
   * Generates a unique Coordinator ID with format BYK-COORD-YYYY-XXXX
   */
  async generateUniqueCoordinatorId() {
    const currentYear = new Date().getFullYear();
    const prefix = `BYK-COORD-${currentYear}-`;
    const users = await User.find({
      $or: [
        { coordinatorId: new RegExp(`^${prefix}`) },
        { memberId: new RegExp(`^${prefix}`) }
      ]
    });

    let maxSeq = 100;
    for (const u of users) {
      const idToTest = u.coordinatorId || (u.memberId && u.memberId.startsWith(prefix) ? u.memberId : null);
      if (idToTest) {
        const match = idToTest.match(/(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxSeq) maxSeq = num;
        }
      }
    }

    let nextSeq = maxSeq + 1;
    let candidate = `${prefix}${String(nextSeq).padStart(4, '0')}`;
    while (await User.findOne({ $or: [{ coordinatorId: candidate }, { memberId: candidate }] })) {
      nextSeq++;
      candidate = `${prefix}${String(nextSeq).padStart(4, '0')}`;
    }
    return candidate;
  }

  /**
   * Admin creates a brand new Coordinator directly
   */
  async createCoordinator(adminUser, coordinatorData) {
    const {
      name,
      email,
      phone,
      bloodGroup,
      dob,
      address,
      district,
      state,
      designation,
      photoUrl,
      password
    } = coordinatorData;

    if (!name || !email || !phone) {
      throw new Error('Full Legal Name, Email Address, and Phone Number are required to create a Coordinator.');
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    const existingUser = await userRepository.findByEmailOrPhone(cleanEmail) || await userRepository.findByPhone(cleanPhone);
    if (existingUser) {
      // Automatically promote existing user to Coordinator with updated credentials/role
      return this.promoteUserToCoordinator(adminUser, existingUser._id.toString(), {
        name,
        designation: designation || 'District Youth Coordinator',
        district: district || existingUser.district,
        state: state || existingUser.state,
        address: address || existingUser.address,
        bloodGroup: bloodGroup || existingUser.bloodGroup,
        photoUrl: photoUrl || existingUser.photoUrl,
        password: password || undefined
      });
    }

    const tempPassword = password && password.length >= 6
      ? password
      : 'BYK@' + Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const coordinatorId = await this.generateUniqueCoordinatorId();
    const finalDesignation = designation || 'District Youth Coordinator';

    let qrCodeUrl = '';
    try {
      const qrData = `https://bharatiyayuvakranti.org/verify/coordinator/${coordinatorId}`;
      qrCodeUrl = await QRCode.toDataURL(qrData);
    } catch (e) {
      qrCodeUrl = '';
    }

    const newCoordinator = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: hashedPassword,
      role: 'Coordinator',
      status: 'active',
      isCoordinator: true,
      coordinatorId,
      memberId: coordinatorId,
      designation: finalDesignation,
      bloodGroup: bloodGroup || 'O+',
      dob: dob || '1995-01-01',
      address: address || '',
      district: district || 'Aligarh',
      state: state || 'Uttar Pradesh',
      photoUrl: photoUrl || '',
      referralCode: `BYK-CRD-${cleanPhone.slice(-4)}`,
      feePaid: true,
      feeAmount: 0,
      idCardGenerated: true,
      appointmentLetterGenerated: true,
      qrCodeUrl,
      verifiedAt: new Date(),
      verifiedBy: adminUser?.name || 'Trustee Administration'
    });

    // Auto send official appointment letter, ID card & credentials via email asynchronously
    try {
      sendCoordinatorAppointmentEmail({
        ...newCoordinator.toObject(),
        temporaryPassword: tempPassword
      }).catch(err => {
        console.warn('⚠️ Coordinator email dispatch warning:', err.message);
      });
    } catch (e) {
      console.warn('⚠️ Coordinator email dispatch prep error:', e.message);
    }

    const { password: _, ...coordinatorSafe } = newCoordinator.toObject();
    return {
      coordinator: coordinatorSafe,
      temporaryPassword: tempPassword
    };
  }

  /**
   * Admin promotes an existing user to Coordinator
   */
  async promoteUserToCoordinator(adminUser, targetIdentifier, updateData = {}) {
    if (!targetIdentifier) {
      throw new Error('User ID, email, or phone is required to promote user to Coordinator.');
    }

    let user = null;
    const mongoose = require('mongoose');
    if (mongoose.Types.ObjectId.isValid(targetIdentifier)) {
      user = await userRepository.findById(targetIdentifier);
    }
    if (!user && typeof targetIdentifier === 'string') {
      const clean = targetIdentifier.trim();
      user = await User.findOne({
        $or: [
          { email: clean.toLowerCase() },
          { phone: clean },
          { memberId: clean },
          { volunteerId: clean },
          { coordinatorId: clean }
        ]
      });
    }

    if (!user) {
      throw new Error(`User not found for identifier '${targetIdentifier}'.`);
    }

    let generatedPassword = null;
    if (!user.password || updateData.resetPassword) {
      const tempPass = 'BYK@' + Math.floor(100000 + Math.random() * 900000);
      user.password = await bcrypt.hash(tempPass, 10);
      generatedPassword = tempPass;
    }

    if (!user.coordinatorId) {
      user.coordinatorId = await this.generateUniqueCoordinatorId();
    }
    if (!user.memberId || user.memberId.startsWith('BYK-DON-')) {
      user.memberId = user.coordinatorId;
    }

    user.role = 'Coordinator';
    user.isCoordinator = true;
    user.status = 'active';

    if (updateData.designation) {
      user.designation = updateData.designation;
    } else if (!user.designation || user.designation.includes('Applicant') || user.designation.includes('Member')) {
      user.designation = 'District Youth Coordinator';
    }

    if (updateData.district) user.district = updateData.district;
    if (updateData.state) user.state = updateData.state;
    if (updateData.address) user.address = updateData.address;
    if (updateData.bloodGroup) user.bloodGroup = updateData.bloodGroup;

    user.idCardGenerated = true;
    user.appointmentLetterGenerated = true;
    user.verifiedAt = new Date();
    user.verifiedBy = adminUser?.name || 'Trustee Administration';

    const qrData = `https://bharatiyayuvakranti.org/verify/coordinator/${user.coordinatorId}`;
    try {
      user.qrCodeUrl = await QRCode.toDataURL(qrData);
    } catch (e) {
      user.qrCodeUrl = '';
    }

    await user.save();

    // Auto send official appointment letter, ID card & credentials via email asynchronously
    try {
      sendCoordinatorAppointmentEmail({
        ...user.toObject(),
        temporaryPassword: generatedPassword || updateData.password || null
      }).catch(err => {
        console.warn('⚠️ Coordinator email dispatch warning:', err.message);
      });
    } catch (e) {
      console.warn('⚠️ Coordinator email dispatch prep error:', e.message);
    }

    const { password: _, ...userSafe } = user.toObject();
    return {
      coordinator: userSafe,
      temporaryPassword: generatedPassword
    };
  }

  /**
   * Admin lists all Coordinators with recruited member stats
   */
  async getAllCoordinators() {
    const coordinators = await User.find({
      $or: [
        { role: 'Coordinator' },
        { isCoordinator: true }
      ]
    }).select('-password').sort({ createdAt: -1 });

    const coordinatorListWithStats = await Promise.all(
      coordinators.map(async (c) => {
        const cId = c._id;
        // Count applications added by this coordinator
        const totalApplications = await MembershipApplication.find({
          $or: [
            { addedByCoordinator: cId },
            { coordinatorId: c.coordinatorId || 'NONE' },
            { coordinatorName: c.name }
          ]
        });

        const pendingCount = totalApplications.filter(a => a.status === 'pending').length;
        const approvedCount = totalApplications.filter(a => a.status === 'approved').length;
        const rejectedCount = totalApplications.filter(a => a.status === 'rejected').length;
        const totalFeesBrought = totalApplications
          .filter(a => a.status === 'approved')
          .reduce((sum, a) => sum + (Number(a.feeAmount || a.amount) || 0), 0);

        return {
          ...c.toObject(),
          stats: {
            totalRecruits: totalApplications.length,
            pendingRecruits: pendingCount,
            approvedRecruits: approvedCount,
            rejectedRecruits: rejectedCount,
            totalFeesBrought
          }
        };
      })
    );

    return coordinatorListWithStats;
  }

  /**
   * Admin inspects all members added by a specific Coordinator
   */
  async getCoordinatorMembers(coordinatorId) {
    const coordinator = await User.findById(coordinatorId).select('name email phone coordinatorId memberId');
    if (!coordinator) {
      throw new Error('Coordinator not found.');
    }

    const applications = await MembershipApplication.find({
      $or: [
        { addedByCoordinator: coordinator._id },
        { coordinatorId: coordinator.coordinatorId || 'NONE' },
        { coordinatorName: coordinator.name }
      ]
    }).sort({ createdAt: -1 });

    // Also find any registered Users tagged with this coordinator
    const registeredUsers = await User.find({
      addedByCoordinator: coordinator._id
    }).select('-password').sort({ createdAt: -1 });

    return {
      coordinator,
      totalCount: applications.length,
      applications,
      approvedUsers: registeredUsers
    };
  }

  /**
   * Coordinator gets their personal stats
   */
  async getMyCoordinatorStats(coordinatorUserId) {
    const coordinator = await User.findById(coordinatorUserId).select('-password');
    if (!coordinator) {
      throw new Error('Coordinator account not found.');
    }

    const orConditions = [
      { addedByCoordinator: coordinator._id }
    ];
    if (coordinator.coordinatorId) orConditions.push({ coordinatorId: coordinator.coordinatorId });
    if (coordinator.memberId) orConditions.push({ coordinatorId: coordinator.memberId });
    if (coordinator.name) orConditions.push({ coordinatorName: { $regex: new RegExp(`^${coordinator.name.trim()}$`, 'i') } });

    const applications = await MembershipApplication.find({
      $or: orConditions
    }).sort({ createdAt: -1 });

    const totalRecruits = applications.length;
    const pendingRecruits = applications.filter(a => a.status === 'pending').length;
    const approvedRecruits = applications.filter(a => a.status === 'approved').length;
    const rejectedRecruits = applications.filter(a => a.status === 'rejected').length;
    const totalFeesBrought = applications
      .filter(a => a.status === 'approved')
      .reduce((sum, a) => sum + (Number(a.feeAmount || a.amount) || 0), 0);

    return {
      coordinator,
      stats: {
        totalRecruits,
        pendingRecruits,
        approvedRecruits,
        rejectedRecruits,
        totalFeesBrought
      },
      recentApplications: applications.slice(0, 10),
      data: {
        stats: {
          totalRecruits,
          pendingRecruits,
          approvedRecruits,
          rejectedRecruits,
          totalFeesBrought
        },
        recentApplications: applications.slice(0, 10)
      }
    };
  }

  /**
   * Coordinator views all members added by them
   */
  async getMyMembers(coordinatorUserId) {
    const coordinator = await User.findById(coordinatorUserId);
    if (!coordinator) {
      throw new Error('Coordinator not found.');
    }

    const orConditions = [
      { addedByCoordinator: coordinator._id }
    ];
    if (coordinator.coordinatorId) orConditions.push({ coordinatorId: coordinator.coordinatorId });
    if (coordinator.memberId) orConditions.push({ coordinatorId: coordinator.memberId });
    if (coordinator.name) orConditions.push({ coordinatorName: { $regex: new RegExp(`^${coordinator.name.trim()}$`, 'i') } });

    const applications = await MembershipApplication.find({
      $or: orConditions
    }).populate('plan').sort({ createdAt: -1 });

    return {
      total: applications.length,
      members: applications,
      data: applications
    };
  }

  /**
   * Coordinator adds a new member (submits application for Admin final approval)
   */
  async addMemberByCoordinator(coordinatorUser, memberData) {
    if (!coordinatorUser) {
      throw new Error('Authentication required.');
    }

    const coordinator = await User.findById(coordinatorUser.id || coordinatorUser._id);
    if (!coordinator) {
      throw new Error('Coordinator account not found.');
    }

    const {
      name,
      email,
      phone,
      planId,
      feeAmount,
      paymentMethod,
      utrNumber,
      transactionId,
      paymentScreenshot,
      bloodGroup,
      dob,
      address,
      district,
      state,
      photoUrl,
      documentType,
      documentFront,
      documentBack,
      designation,
      notes
    } = memberData;

    if (!name || (!email && !phone)) {
      throw new Error('Member Full Name and at least Email or Mobile Phone are mandatory.');
    }

    if (!planId) {
      throw new Error('Please select an Executive Membership Plan.');
    }

    const plan = await planRepository.findById(planId);
    if (!plan) {
      throw new Error('Selected membership plan was not found.');
    }

    // Attach coordinator's metadata so admin sees "Added by Coordinator"
    const finalUtr = utrNumber || transactionId || 'COORDINATOR_ENROLLED';
    const finalScreenshot = paymentScreenshot || memberData.screenshotUrl || '';

    const appPayload = {
      name: name.trim(),
      email: (email || '').toLowerCase().trim(),
      phone: (phone || '').trim(),
      planId: plan._id.toString(),
      planName: plan.title || plan.name,
      amount: feeAmount || plan.price || plan.fee || 250,
      feeAmount: feeAmount || plan.price || plan.fee || 250,
      paymentMethod: paymentMethod || 'UPI',
      utrNumber: finalUtr,
      transactionId: finalUtr,
      paymentScreenshot: finalScreenshot,
      bloodGroup: bloodGroup || 'O+',
      dob: dob || '2000-01-01',
      address: address || '',
      district: district || coordinator.district || coordinatorUser.district || 'Aligarh',
      state: state || coordinator.state || coordinatorUser.state || 'Uttar Pradesh',
      photoUrl: photoUrl || '',
      documentType: documentType || 'Aadhaar Card',
      documentFront: documentFront || '',
      documentBack: documentBack || '',
      designation: designation || `${plan.title || plan.name} Member`,
      notes: notes || `Enrolled directly by Coordinator ${coordinator.name}`,
      addedByCoordinator: coordinator._id,
      coordinatorName: coordinator.name,
      coordinatorId: coordinator.coordinatorId || coordinator.memberId || '',
      addedByRole: 'Coordinator'
    };

    const application = await applicationService.applyMembership(null, appPayload);
    return application;
  }

  /**
   * Resend credentials & appointment letter to coordinator
   */
  async resendCoordinatorCredentials(adminUser, coordinatorId) {
    if (!coordinatorId) {
      throw new Error('Coordinator identifier is required.');
    }

    let coordinator = null;
    if (mongoose.Types.ObjectId.isValid(coordinatorId)) {
      coordinator = await User.findById(coordinatorId);
    }
    if (!coordinator) {
      coordinator = await User.findOne({
        $or: [
          { coordinatorId: coordinatorId },
          { memberId: coordinatorId },
          { email: coordinatorId }
        ]
      });
    }

    if (!coordinator) {
      throw new Error(`Coordinator not found for identifier: ${coordinatorId}`);
    }

    // Generate new secure temporary password
    const tempPassword = 'BYK@' + Math.floor(100000 + Math.random() * 900000);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Update password in DB
    coordinator.password = hashedPassword;
    await coordinator.save();

    // Send updated appointment letter, ID card, and credentials via email asynchronously (non-blocking)
    // so slow SMTP connections never cause frontend Axios request timeouts
    try {
      sendCoordinatorAppointmentEmail({
        ...coordinator.toObject(),
        temporaryPassword: tempPassword
      }).catch(err => {
        console.warn(`⚠️ [EMAIL NOTICE] Background email dispatch for coordinator ${coordinator.email} failed:`, err.message);
      });
    } catch (err) {
      console.warn(`⚠️ [EMAIL NOTICE] Failed to trigger background email for coordinator ${coordinator.email}:`, err.message);
    }

    return {
      success: true,
      message: `New credentials generated successfully! Appointment letter & credentials sent to ${coordinator.email}.`,
      temporaryPassword: tempPassword,
      coordinator: {
        _id: coordinator._id,
        id: coordinator._id,
        name: coordinator.name,
        email: coordinator.email,
        phone: coordinator.phone,
        district: coordinator.district,
        state: coordinator.state,
        designation: coordinator.designation,
        coordinatorId: coordinator.coordinatorId || coordinator.memberId || 'BYK-COORD'
      }
    };
  }

  /**
   * Coordinator updates details of an enrolled member application
   */
  async updateMemberByCoordinator(coordinatorUser, applicationId, updateData) {
    if (!coordinatorUser) throw new Error('Authentication required.');

    const coordinator = await User.findById(coordinatorUser.id || coordinatorUser._id);
    if (!coordinator && coordinatorUser.role !== 'Admin') {
      throw new Error('Coordinator account not found.');
    }

    const application = await MembershipApplication.findById(applicationId);
    if (!application) {
      throw new Error('Member application not found.');
    }

    // Permission check: ensure member was added by this coordinator (or user is admin)
    const isAdmin = coordinatorUser.role === 'Admin' || coordinatorUser.role === 'admin';
    const isOwner = coordinator && (
      (application.addedByCoordinator && application.addedByCoordinator.toString() === coordinator._id.toString()) ||
      (application.coordinatorId && (application.coordinatorId === coordinator.coordinatorId || application.coordinatorId === coordinator.memberId)) ||
      (application.coordinatorName && application.coordinatorName.toLowerCase() === coordinator.name.toLowerCase())
    );

    if (!isAdmin && !isOwner) {
      throw new Error('Access denied. You can only edit members enrolled through your coordinator portal.');
    }

    const allowedFields = [
      'name', 'email', 'phone', 'bloodGroup', 'dob', 'address', 'district', 'state',
      'photoUrl', 'documentType', 'documentFront', 'documentBack', 'idProofUrl',
      'designation', 'notes', 'utrNumber', 'transactionId', 'paymentScreenshot',
      'paymentScreenshotUrl', 'paymentMethod', 'planId', 'planName', 'feeAmount', 'amount'
    ];

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        application[field] = updateData[field];
      }
    });

    if (updateData.documentFront || updateData.idProofUrl) {
      const docFront = updateData.documentFront || updateData.idProofUrl;
      application.documentFront = docFront;
      application.idProofUrl = docFront;
    }

    if (updateData.paymentScreenshot || updateData.paymentScreenshotUrl) {
      const screen = updateData.paymentScreenshot || updateData.paymentScreenshotUrl;
      application.paymentScreenshot = screen;
      application.paymentScreenshotUrl = screen;
    }

    if (updateData.utrNumber || updateData.transactionId) {
      const utr = updateData.utrNumber || updateData.transactionId;
      application.utrNumber = utr;
      application.transactionId = utr;
    }

    if (updateData.feeAmount || updateData.amount) {
      const amt = Number(updateData.feeAmount || updateData.amount);
      application.feeAmount = amt;
      application.amount = amt;
    }

    await application.save();

    // If an associated User account exists, sync basic profile fields
    const linkedUserId = application.user || application.userId;
    if (linkedUserId) {
      const userUpdate = {};
      if (updateData.name) userUpdate.name = updateData.name;
      if (updateData.phone) userUpdate.phone = updateData.phone;
      if (updateData.bloodGroup) userUpdate.bloodGroup = updateData.bloodGroup;
      if (updateData.dob) userUpdate.dob = updateData.dob;
      if (updateData.address) userUpdate.address = updateData.address;
      if (updateData.district) userUpdate.district = updateData.district;
      if (updateData.state) userUpdate.state = updateData.state;
      if (updateData.photoUrl) userUpdate.photoUrl = updateData.photoUrl;
      if (updateData.documentType) userUpdate.documentType = updateData.documentType;
      if (updateData.documentFront || updateData.idProofUrl) userUpdate.documentFront = updateData.documentFront || updateData.idProofUrl;
      if (updateData.documentBack) userUpdate.documentBack = updateData.documentBack;
      if (updateData.designation) userUpdate.designation = updateData.designation;

      if (Object.keys(userUpdate).length > 0) {
        await User.findByIdAndUpdate(linkedUserId, userUpdate);
      }
    }

    return application;
  }

  /**
   * Coordinator deletes/cancels a member application enrolled by them
   */
  async deleteMemberByCoordinator(coordinatorUser, applicationId) {
    if (!coordinatorUser) throw new Error('Authentication required.');

    const coordinator = await User.findById(coordinatorUser.id || coordinatorUser._id);
    if (!coordinator && coordinatorUser.role !== 'Admin') {
      throw new Error('Coordinator account not found.');
    }

    const application = await MembershipApplication.findById(applicationId);
    if (!application) {
      throw new Error('Member application not found.');
    }

    const isAdmin = coordinatorUser.role === 'Admin' || coordinatorUser.role === 'admin';
    const isOwner = coordinator && (
      (application.addedByCoordinator && application.addedByCoordinator.toString() === coordinator._id.toString()) ||
      (application.coordinatorId && (application.coordinatorId === coordinator.coordinatorId || application.coordinatorId === coordinator.memberId)) ||
      (application.coordinatorName && application.coordinatorName.toLowerCase() === coordinator.name.toLowerCase())
    );

    if (!isAdmin && !isOwner) {
      throw new Error('Access denied. You can only remove members enrolled through your coordinator portal.');
    }

    await MembershipApplication.findByIdAndDelete(applicationId);

    return {
      success: true,
      message: `Enrolled application for ${application.name || 'Member'} deleted successfully.`
    };
  }

  /**
   * Admin updates coordinator details
   */
  async updateCoordinator(adminUser, coordinatorId, updateData) {
    const coordinator = await User.findById(coordinatorId);
    if (!coordinator) {
      throw new Error('Coordinator not found.');
    }

    const {
      name,
      email,
      phone,
      bloodGroup,
      dob,
      address,
      district,
      state,
      designation,
      photoUrl,
      status,
      password,
      coordinatorId: newCoordId
    } = updateData;

    if (name) coordinator.name = name.trim();
    if (email) coordinator.email = email.toLowerCase().trim();
    if (phone) coordinator.phone = phone.trim();
    if (bloodGroup) coordinator.bloodGroup = bloodGroup;
    if (dob) coordinator.dob = dob;
    if (address !== undefined) coordinator.address = address;
    if (district) coordinator.district = district;
    if (state) coordinator.state = state;
    if (designation) coordinator.designation = designation;
    if (photoUrl !== undefined) coordinator.photoUrl = photoUrl;
    if (status && ['active', 'blocked', 'deactivated', 'pending'].includes(status)) {
      coordinator.status = status;
    }
    if (newCoordId) coordinator.coordinatorId = newCoordId.trim();

    if (password && password.trim().length >= 6) {
      coordinator.password = await bcrypt.hash(password.trim(), 10);
    }

    await coordinator.save();

    return coordinator;
  }

  /**
   * Admin revokes coordinator privileges or deletes coordinator account
   */
  async deleteCoordinator(adminUser, coordinatorId, options = {}) {
    const coordinator = await User.findById(coordinatorId);
    if (!coordinator) {
      throw new Error('Coordinator not found.');
    }

    if (adminUser && adminUser.id === coordinatorId) {
      throw new Error('You cannot delete or revoke your own administrative account.');
    }

    const action = options.action || (options.hardDelete ? 'delete' : 'revoke');

    if (action === 'delete') {
      await User.findByIdAndDelete(coordinatorId);
      return {
        success: true,
        message: `Coordinator account for ${coordinator.name} deleted permanently.`
      };
    } else {
      coordinator.isCoordinator = false;
      coordinator.coordinatorId = undefined;
      if (coordinator.role === 'Coordinator') {
        coordinator.role = coordinator.isMember ? 'Member' : (coordinator.isVolunteer ? 'Volunteer' : 'Donor');
      }
      await coordinator.save();

      return {
        success: true,
        message: `Coordinator privileges for ${coordinator.name} revoked successfully. Role updated to ${coordinator.role}.`,
        coordinator
      };
    }
  }
}

module.exports = new CoordinatorService();
