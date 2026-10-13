const QRCode = require('qrcode');
const applicationRepository = require('../repositories/applicationRepository');
const userRepository = require('../repositories/userRepository');
const planRepository = require('../repositories/planRepository');
const { sendMembershipApprovalEmail, sendVolunteerApprovalEmail } = require('./emailService');

class ApplicationService {
  async applyMembership(userId, appData) {
    const { planId, paymentScreenshot, utrNumber } = appData;
    if (!planId) throw new Error('Please select a membership plan');
    if (!paymentScreenshot) throw new Error('Payment screenshot is mandatory for verification');

    const plan = await planRepository.findById(planId);
    if (!plan) throw new Error('Selected membership plan not found');

    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const application = await applicationRepository.createMembershipApp({
      user: userId,
      plan: planId,
      amount: plan.price,
      paymentScreenshot,
      utrNumber: utrNumber || '',
      status: 'pending'
    });

    user.membershipPlan = planId;
    user.status = 'pending';
    await user.save();

    return application;
  }

  async applyVolunteer(userId, appData) {
    const { skills, availability, idProofDocument, motivation } = appData;
    if (!idProofDocument) throw new Error('Government ID proof upload is required for volunteer verification');

    const user = await userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const application = await applicationRepository.createVolunteerApp({
      user: userId,
      skills: Array.isArray(skills) ? skills : [skills || 'Community Outreach'],
      availability: availability || 'Weekends',
      idProofDocument,
      motivation: motivation || '',
      status: 'pending'
    });

    user.status = 'pending';
    await user.save();

    return application;
  }

  async getMembershipApplications(filter = {}) {
    return applicationRepository.findMembershipApps(filter);
  }

  async getVolunteerApplications(filter = {}) {
    return applicationRepository.findVolunteerApps(filter);
  }

  async approveMembershipApplication(appId, adminUser) {
    const app = await applicationRepository.findMembershipAppById(appId);
    if (!app) throw new Error('Membership application not found');

    const user = await userRepository.findById(app.user._id || app.user);
    if (!user) throw new Error('Associated member account not found');

    const plan = await planRepository.findById(app.plan._id || app.plan);

    const memberSeq = await userRepository.count({ role: 'Member', status: 'active' });
    const verifiedMemberId = `BYK-MEM-2026-${1000 + memberSeq + 1}`;

    user.status = 'active';
    user.role = 'Member';
    user.memberId = verifiedMemberId;
    user.designation = plan ? `${plan.title} Member` : 'Verified Member';
    user.feePaid = true;
    user.feeAmount = app.amount;
    user.idCardGenerated = true;
    user.appointmentLetterGenerated = true;
    user.verifiedAt = new Date();
    user.verifiedBy = adminUser.name || 'Trustee Admin';

    const qrData = `https://bharatiyayuvakranti.org/verify/member/${verifiedMemberId}`;
    user.qrCodeUrl = await QRCode.toDataURL(qrData);
    await user.save();

    app.status = 'approved';
    app.reviewedBy = adminUser.name || 'Trustee Admin';
    app.reviewedAt = new Date();
    await app.save();

    // Auto send official appointment letter & verified credentials via email
    await sendMembershipApprovalEmail(user);

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

    const user = await userRepository.findById(app.user._id || app.user);
    if (user) {
      user.status = 'rejected';
      await user.save();
    }

    return app;
  }

  async approveVolunteerApplication(appId, adminUser) {
    const app = await applicationRepository.findVolunteerAppById(appId);
    if (!app) throw new Error('Volunteer application not found');

    const user = await userRepository.findById(app.user._id || app.user);
    if (!user) throw new Error('Volunteer account not found');

    const volSeq = await userRepository.count({ role: 'Volunteer', status: 'active' });
    const verifiedVolId = `BYK-VOL-2026-${500 + volSeq + 1}`;

    user.status = 'active';
    user.role = 'Volunteer';
    user.memberId = verifiedVolId;
    user.designation = 'Active Volunteer (Youth Wing)';
    user.idCardGenerated = true;
    user.appointmentLetterGenerated = true;
    user.verifiedAt = new Date();
    user.verifiedBy = adminUser.name || 'Trustee Admin';

    const qrData = `https://bharatiyayuvakranti.org/verify/volunteer/${verifiedVolId}`;
    user.qrCodeUrl = await QRCode.toDataURL(qrData);
    await user.save();

    app.status = 'approved';
    app.reviewedBy = adminUser.name || 'Trustee Admin';
    app.reviewedAt = new Date();
    await app.save();

    await sendVolunteerApprovalEmail(user);

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
}

module.exports = new ApplicationService();
