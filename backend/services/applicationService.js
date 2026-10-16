const QRCode = require('qrcode');
const applicationRepository = require('../repositories/applicationRepository');
const userRepository = require('../repositories/userRepository');
const planRepository = require('../repositories/planRepository');
const { sendMembershipApprovalEmail, sendVolunteerApprovalEmail } = require('./emailService');

class ApplicationService {
  async applyMembership(userId, appData) {
    const { 
      planId, 
      paymentScreenshot, 
      utrNumber, 
      bloodGroup, 
      dob, 
      address, 
      district, 
      state, 
      photoUrl, 
      designation 
    } = appData;

    const finalScreenshot = paymentScreenshot || appData.paymentProof || appData.screenshotUrl;
    const finalUtr = utrNumber || appData.transactionId || '';

    if (!planId) throw new Error('Please select a membership plan');
    if (!finalScreenshot && !finalUtr) throw new Error('Payment screenshot or transaction UTR is mandatory for verification');

    const plan = await planRepository.findById(planId);
    if (!plan) throw new Error('Selected membership plan not found');

    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    // Update user record with additional application info
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (dob) user.dob = dob;
    if (address) user.address = address;
    if (district) user.district = district;
    if (state) user.state = state;
    if (photoUrl) user.photoUrl = photoUrl;
    if (designation) user.designation = designation;

    user.membershipPlan = planId;
    user.feeAmount = plan.price || plan.fee || 250;
    user.feePaid = true;
    user.status = 'pending';
    await user.save();

    const application = await applicationRepository.createMembershipApp({
      user: userId,
      plan: planId,
      amount: plan.price || plan.fee || 250,
      paymentScreenshot: finalScreenshot || '',
      utrNumber: finalUtr,
      status: 'pending'
    });

    return application;
  }

  async applyVolunteer(userId, appData) {
    const { 
      skills, 
      availability, 
      idProofDocument, 
      idProofUrl,
      motivation, 
      whyJoin,
      bloodGroup, 
      dob, 
      address, 
      district, 
      state, 
      photoUrl 
    } = appData;

    const finalIdProof = idProofDocument || idProofUrl || appData.idProof;
    if (!finalIdProof) throw new Error('Government ID proof upload is required for volunteer verification');

    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    // Update user record with additional application info
    if (bloodGroup) user.bloodGroup = bloodGroup;
    if (dob) user.dob = dob;
    if (address) user.address = address;
    if (district) user.district = district;
    if (state) user.state = state;
    if (photoUrl) user.photoUrl = photoUrl;

    user.status = 'pending';
    await user.save();

    const application = await applicationRepository.createVolunteerApp({
      user: userId,
      skills: Array.isArray(skills) ? skills : [skills || 'Community Outreach'],
      availability: availability || 'Weekends',
      idProofDocument: finalIdProof,
      motivation: motivation || whyJoin || '',
      status: 'pending'
    });

    return application;
  }

  async getMembershipApplications(filter = {}) {
    return applicationRepository.findMembershipApps(filter);
  }

  async getVolunteerApplications(filter = {}) {
    return applicationRepository.findVolunteerApps(filter);
  }

  async generateUniqueMemberId() {
    const currentYear = new Date().getFullYear();
    const prefix = `BYK-MEM-${currentYear}-`;
    const users = await userRepository.find({ memberId: new RegExp(`^${prefix}`) });
    let maxSeq = 1000;
    for (const u of users) {
      if (u.memberId) {
        const match = u.memberId.match(/(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxSeq) maxSeq = num;
        }
      }
    }
    let nextSeq = maxSeq + 1;
    let candidate = `${prefix}${nextSeq}`;
    while (await userRepository.findByMemberId(candidate)) {
      nextSeq++;
      candidate = `${prefix}${nextSeq}`;
    }
    return candidate;
  }

  async generateUniqueVolunteerId() {
    const currentYear = new Date().getFullYear();
    const prefix = `BYK-VOL-${currentYear}-`;
    const users = await userRepository.find({ 
      $or: [
        { volunteerId: new RegExp(`^${prefix}`) },
        { memberId: new RegExp(`^${prefix}`) }
      ]
    });
    let maxSeq = 500;
    for (const u of users) {
      const idToTest = u.volunteerId || u.memberId;
      if (idToTest) {
        const match = idToTest.match(/(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxSeq) maxSeq = num;
        }
      }
    }
    let nextSeq = maxSeq + 1;
    let candidate = `${prefix}${nextSeq}`;
    while (await userRepository.findByVolunteerId(candidate)) {
      nextSeq++;
      candidate = `${prefix}${nextSeq}`;
    }
    return candidate;
  }

  async approveMembershipApplication(appId, adminUser) {
    const app = await applicationRepository.findMembershipAppById(appId);
    if (!app) throw new Error('Membership application not found');

    const userId = app.user?._id || app.user || app.userId;
    let user = userId ? await userRepository.findById(userId) : null;
    if (!user && app.email) {
      user = await userRepository.findByEmail(app.email);
    }
    if (!user) throw new Error('Associated member account not found');

    const plan = app.plan ? await planRepository.findById(app.plan._id || app.plan) : null;

    const verifiedMemberId = user.memberId || await this.generateUniqueMemberId();

    user.status = 'active';
    user.role = 'Member';
    user.isMember = true;
    user.memberId = verifiedMemberId;
    user.designation = plan ? `${plan.title || plan.name} Member` : 'Verified Active Member';
    user.feePaid = true;
    user.feeAmount = app.amount || app.feeAmount || 250;
    user.idCardGenerated = true;
    user.appointmentLetterGenerated = true;
    user.verifiedAt = new Date();
    user.verifiedBy = adminUser.name || 'Trustee Admin';

    const qrData = `https://bharatiyayuvakranti.org/verify/member/${verifiedMemberId}`;
    try {
      user.qrCodeUrl = await QRCode.toDataURL(qrData);
    } catch (e) {
      user.qrCodeUrl = '';
    }
    await user.save();

    app.status = 'approved';
    app.assignedMemberId = verifiedMemberId;
    app.reviewedBy = adminUser.name || 'Trustee Admin';
    app.reviewedAt = new Date();
    await app.save();

    // Auto send official appointment letter & verified credentials via email safely
    try {
      await sendMembershipApprovalEmail(user);
    } catch (e) {
      console.warn('Membership approval email send warning:', e.message);
    }

    return { application: app, user };
  }

  async rejectMembershipApplication(appId, reason, adminUser) {
    const app = await applicationRepository.findMembershipAppById(appId);
    if (!app) throw new Error('Membership application not found');

    app.status = 'rejected';
    app.rejectionReason = reason || 'Payment proof verification failed';
    app.reviewedBy = adminUser.name || 'Trustee Admin';
    app.reviewedAt = new Date();
    await app.save();

    const userId = app.user?._id || app.user || app.userId;
    let user = userId ? await userRepository.findById(userId) : null;
    if (!user && app.email) {
      user = await userRepository.findByEmail(app.email);
    }
    if (user) {
      user.status = 'rejected';
      await user.save();
    }

    return app;
  }

  async approveVolunteerApplication(appId, adminUser) {
    const app = await applicationRepository.findVolunteerAppById(appId);
    if (!app) throw new Error('Volunteer application not found');

    const userId = app.user?._id || app.user || app.userId;
    let user = userId ? await userRepository.findById(userId) : null;
    if (!user && app.email) {
      user = await userRepository.findByEmail(app.email);
    }
    if (!user) throw new Error('Volunteer account not found');

    const verifiedVolId = user.volunteerId || await this.generateUniqueVolunteerId();

    user.status = 'active';
    user.role = 'Volunteer';
    user.isVolunteer = true;
    user.volunteerId = verifiedVolId;
    if (user.memberId && user.memberId.startsWith('BYK-DON-')) {
      user.memberId = undefined;
    }
    user.designation = 'Active Volunteer (Youth Wing)';
    user.idCardGenerated = true;
    user.appointmentLetterGenerated = true;
    user.verifiedAt = new Date();
    user.verifiedBy = adminUser.name || 'Trustee Admin';

    const qrData = `https://bharatiyayuvakranti.org/verify/volunteer/${verifiedVolId}`;
    try {
      user.qrCodeUrl = await QRCode.toDataURL(qrData);
    } catch (e) {
      user.qrCodeUrl = '';
    }
    await user.save();

    app.status = 'approved';
    app.assignedVolunteerId = verifiedVolId;
    app.reviewedBy = adminUser.name || 'Trustee Admin';
    app.reviewedAt = new Date();
    await app.save();

    // Auto send official offer letter & badge via email safely
    try {
      await sendVolunteerApprovalEmail(user);
    } catch (e) {
      console.warn('Volunteer approval email send warning:', e.message);
    }

    return { application: app, user };
  }

  async rejectVolunteerApplication(appId, reason, adminUser) {
    const app = await applicationRepository.findVolunteerAppById(appId);
    if (!app) throw new Error('Volunteer application not found');

    app.status = 'rejected';
    app.rejectionReason = reason || 'Verification documents not clear';
    app.reviewedBy = adminUser.name || 'Trustee Admin';
    app.reviewedAt = new Date();
    await app.save();

    const user = await userRepository.findById(app.user._id || app.user);
    if (user) {
      user.status = 'rejected';
      await user.save();
    }

    return app;
  }

  async deleteMembershipApplication(appId) {
    const app = await applicationRepository.findMembershipAppById(appId);
    if (!app) throw new Error('Membership application not found');
    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(app);
    return applicationRepository.deleteMembershipApp(appId);
  }

  async deleteVolunteerApplication(appId) {
    const app = await applicationRepository.findVolunteerAppById(appId);
    if (!app) throw new Error('Volunteer application not found');
    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(app);
    return applicationRepository.deleteVolunteerApp(appId);
  }
}

module.exports = new ApplicationService();
