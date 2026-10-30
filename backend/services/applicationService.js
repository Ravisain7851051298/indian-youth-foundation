const QRCode = require('qrcode');
const bcrypt = require('bcryptjs');
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
      designation,
      name,
      email,
      phone,
      addedByCoordinator,
      coordinatorName,
      coordinatorId,
      addedByRole
    } = appData;

    const finalScreenshot = paymentScreenshot || appData.paymentProof || appData.screenshotUrl;
    const finalUtr = utrNumber || appData.transactionId || '';
    const finalPhoto = photoUrl || appData.userPhoto || appData.avatar || '';
    const finalDocType = appData.documentType || '';
    const finalDocFront = appData.documentFront || appData.idProofUrl || '';
    const finalDocBack = appData.documentBack || '';

    if (!planId) throw new Error('Please select a membership plan');
    if (!finalScreenshot && !finalUtr) throw new Error('Payment screenshot or transaction UTR is mandatory for verification');

    const plan = await planRepository.findById(planId);
    if (!plan) throw new Error('Selected membership plan not found');

    const cleanEmail = email ? email.toLowerCase().trim() : undefined;
    const cleanPhone = (phone || '').trim();
    const effectiveEmail = cleanEmail || undefined;

    let user = userId ? await userRepository.findById(userId) : null;
    if (!user && cleanPhone) {
      user = await userRepository.findByPhone(cleanPhone);
    }
    if (!user && effectiveEmail) {
      user = await userRepository.findByEmail(effectiveEmail);
    }

    if (!user) {
      if (!name || !cleanPhone) {
        throw new Error('Please provide your Full Legal Name and Mobile Number for membership enrollment.');
      }

      const assignedMemberId = await this.generateUniqueMemberId();
      const hashedPassword = await bcrypt.hash(cleanPhone, 10);

      user = await userRepository.create({
        name: name.trim(),
        email: effectiveEmail,
        phone: cleanPhone,
        password: hashedPassword,
        role: 'Member',
        status: 'pending',
        isMember: true,
        memberId: assignedMemberId,
        designation: designation || (plan ? `${plan.title || plan.name} Member` : 'Member Applicant'),
        bloodGroup: bloodGroup || 'O+',
        dob: dob || '2000-01-01',
        address: address || '',
        district: district || 'Aligarh',
        state: state || 'Uttar Pradesh',
        photoUrl: finalPhoto || '',
        documentType: finalDocType || '',
        documentFront: finalDocFront || '',
        documentBack: finalDocBack || '',
        feePaid: true,
        feeAmount: plan.price || plan.fee || 250,
        membershipPlan: planId,
        addedByCoordinator: addedByCoordinator || null,
        addedByCoordinatorName: coordinatorName || '',
        notes: 'Created via Membership Application'
      });
    } else {
      // Update existing user record with additional application info
      if (!user.memberId) {
        user.memberId = await this.generateUniqueMemberId();
      }
      if (!user.password && cleanPhone) {
        user.password = await bcrypt.hash(cleanPhone, 10);
      }
      if (effectiveEmail && !user.email) {
        user.email = effectiveEmail;
      }
      if (bloodGroup) user.bloodGroup = bloodGroup;
      if (dob) user.dob = dob;
      if (address) user.address = address;
      if (district) user.district = district;
      if (state) user.state = state;
      if (finalPhoto) user.photoUrl = finalPhoto;
      if (finalDocType) user.documentType = finalDocType;
      if (finalDocFront) user.documentFront = finalDocFront;
      if (finalDocBack) user.documentBack = finalDocBack;
      if (designation) user.designation = designation;
      if (addedByCoordinator) user.addedByCoordinator = addedByCoordinator;
      if (coordinatorName) user.addedByCoordinatorName = coordinatorName;

      user.membershipPlan = planId;
      user.feeAmount = plan.price || plan.fee || 250;
      user.feePaid = true;
      if (user.status !== 'active') user.status = 'pending';
      await user.save();
    }

    const application = await applicationRepository.createMembershipApp({
      user: user._id,
      userId: user._id,
      isGuest: !userId,
      name: name || user.name || '',
      email: effectiveEmail || user.email || '',
      phone: cleanPhone || user.phone || '',
      plan: planId,
      planId: plan._id?.toString() || planId,
      planName: plan.title || plan.name || 'Membership Plan',
      amount: plan.price || plan.fee || 250,
      feeAmount: plan.price || plan.fee || 250,
      paymentScreenshot: finalScreenshot || '',
      utrNumber: finalUtr,
      transactionId: finalUtr,
      bloodGroup: bloodGroup || user.bloodGroup || 'O+',
      dob: dob || user.dob || '2000-01-01',
      address: address || user.address || '',
      district: district || user.district || 'Aligarh',
      state: state || user.state || 'Uttar Pradesh',
      photoUrl: finalPhoto || user.photoUrl || '',
      documentType: finalDocType,
      documentFront: finalDocFront,
      documentBack: finalDocBack,
      idProofUrl: finalDocFront,
      designation: designation || user.designation || `${plan.title || plan.name} Member`,
      assignedMemberId: user.memberId,
      addedByCoordinator: addedByCoordinator || null,
      coordinatorName: coordinatorName || '',
      coordinatorId: coordinatorId || '',
      addedByRole: addedByRole || (addedByCoordinator ? 'Coordinator' : ''),
      status: 'pending'
    });

    return {
      application,
      credentials: {
        id: user.memberId,
        password: cleanPhone || user.phone,
        email: user.email || '',
        name: user.name,
        role: 'Member'
      }
    };
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
      photoUrl,
      name,
      email,
      phone
    } = appData;

    const finalPhoto = photoUrl || appData.userPhoto || appData.avatar || '';
    const finalDocType = appData.documentType || '';
    const finalDocFront = appData.documentFront || idProofDocument || idProofUrl || appData.idProof || '';
    const finalDocBack = appData.documentBack || '';
    const finalIdProof = finalDocFront || idProofDocument || idProofUrl || appData.idProof || '';

    const cleanEmail = email ? email.toLowerCase().trim() : undefined;
    const cleanPhone = (phone || '').trim();
    const effectiveEmail = cleanEmail || undefined;

    let user = userId ? await userRepository.findById(userId) : null;
    if (!user && cleanPhone) {
      user = await userRepository.findByPhone(cleanPhone);
    }
    if (!user && effectiveEmail) {
      user = await userRepository.findByEmail(effectiveEmail);
    }

    if (!user) {
      if (!name || !cleanPhone) {
        throw new Error('Please provide your Full Legal Name and Mobile Number for volunteer enrollment.');
      }

      const assignedVolunteerId = await this.generateUniqueVolunteerId();
      const hashedPassword = await bcrypt.hash(cleanPhone, 10);

      user = await userRepository.create({
        name: name.trim(),
        email: effectiveEmail,
        phone: cleanPhone,
        password: hashedPassword,
        role: 'Volunteer',
        status: 'pending',
        isVolunteer: true,
        volunteerId: assignedVolunteerId,
        volunteerWing: 'Active Grassroots Youth Volunteer',
        volunteerStatus: 'pending',
        designation: 'Volunteer Applicant (Youth Wing)',
        bloodGroup: bloodGroup || 'O+',
        dob: dob || '2000-01-01',
        address: address || '',
        district: district || 'Aligarh',
        state: state || 'Uttar Pradesh',
        photoUrl: finalPhoto || '',
        documentType: finalDocType || '',
        documentFront: finalDocFront || '',
        documentBack: finalDocBack || '',
        feePaid: true,
        feeAmount: 0,
        notes: 'Created via Volunteer Application'
      });
    } else {
      // Update existing user record with volunteer details
      if (!user.volunteerId) {
        user.volunteerId = await this.generateUniqueVolunteerId();
      }
      if (!user.password && cleanPhone) {
        user.password = await bcrypt.hash(cleanPhone, 10);
      }
      if (effectiveEmail && !user.email) {
        user.email = effectiveEmail;
      }
      if (bloodGroup) user.bloodGroup = bloodGroup;
      if (dob) user.dob = dob;
      if (address) user.address = address;
      if (district) user.district = district;
      if (state) user.state = state;
      if (finalPhoto) user.photoUrl = finalPhoto;
      if (finalDocType) user.documentType = finalDocType;
      if (finalDocFront) user.documentFront = finalDocFront;
      if (finalDocBack) user.documentBack = finalDocBack;
      if (user.status !== 'active') user.status = 'pending';
      await user.save();
    }

    const application = await applicationRepository.createVolunteerApp({
      user: user._id,
      userId: user._id,
      isGuest: !userId,
      name: name || user.name || '',
      email: effectiveEmail || user.email || '',
      phone: cleanPhone || user.phone || '',
      skills: Array.isArray(skills) ? skills : [skills || 'Community Outreach'],
      availability: availability || 'Weekends',
      interests: appData.interests || '',
      documentType: finalDocType,
      documentFront: finalDocFront,
      documentBack: finalDocBack,
      idProofDocument: finalIdProof,
      idProofUrl: finalIdProof,
      motivation: motivation || whyJoin || '',
      whyJoin: motivation || whyJoin || '',
      bloodGroup: bloodGroup || user.bloodGroup || 'O+',
      dob: dob || user.dob || '2000-01-01',
      address: address || user.address || '',
      district: district || user.district || 'Aligarh',
      state: state || user.state || 'Uttar Pradesh',
      photoUrl: finalPhoto || user.photoUrl || '',
      assignedVolunteerId: user.volunteerId,
      status: 'pending'
    });

    return {
      application,
      credentials: {
        id: user.volunteerId,
        password: cleanPhone || user.phone,
        email: user.email || '',
        name: user.name,
        role: 'Volunteer'
      }
    };
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
      user = await userRepository.findByEmail(app.email.toLowerCase().trim());
    }

    const plan = app.plan ? await planRepository.findById(app.plan._id || app.plan) : null;
    const verifiedMemberId = (user && user.memberId) || await this.generateUniqueMemberId();
    let generatedPassword = null;
    const isGuest = Boolean(app.isGuest || !app.user || !app.userId);

    if (!user) {
      // Auto-create new User account for applicant
      const tempPass = app.phone ? app.phone.trim() : ('BYK@' + Math.floor(100000 + Math.random() * 900000));
      const hashedPassword = await bcrypt.hash(tempPass, 10);
      generatedPassword = tempPass;

      user = await userRepository.create({
        name: app.name || 'Valued Member',
        email: app.email ? app.email.toLowerCase().trim() : undefined,
        phone: app.phone ? app.phone.trim() : '9999999999',
        password: hashedPassword,
        role: 'Member',
        status: 'active',
        isMember: true,
        memberId: verifiedMemberId,
        designation: app.designation || (plan ? `${plan.title || plan.name} Member` : 'Verified Active Member'),
        bloodGroup: app.bloodGroup || 'O+',
        dob: app.dob || '2000-01-01',
        address: app.address || '',
        district: app.district || 'Aligarh',
        state: app.state || 'Uttar Pradesh',
        photoUrl: app.photoUrl || '',
        documentType: app.documentType || '',
        documentFront: app.documentFront || '',
        documentBack: app.documentBack || '',
        feePaid: true,
        feeAmount: app.amount || app.feeAmount || (plan ? (plan.price || plan.fee || 250) : 250),
        idCardGenerated: true,
        appointmentLetterGenerated: true,
        verifiedAt: new Date(),
        verifiedBy: adminUser?.name || 'Trustee Admin'
      });

      app.user = user._id;
      app.userId = user._id;
    } else {
      user.status = 'active';
      user.role = 'Member';
      user.isMember = true;
      user.memberId = verifiedMemberId;
      user.designation = app.designation || (plan ? `${plan.title || plan.name} Member` : 'Verified Active Member');
      if (app.photoUrl && !user.photoUrl) user.photoUrl = app.photoUrl;
      if (app.documentType) user.documentType = app.documentType;
      if (app.documentFront) user.documentFront = app.documentFront;
      if (app.documentBack) user.documentBack = app.documentBack;
      user.feePaid = true;
      user.feeAmount = app.amount || app.feeAmount || 250;
      user.idCardGenerated = true;
      user.appointmentLetterGenerated = true;
      user.verifiedAt = new Date();
      user.verifiedBy = adminUser?.name || 'Trustee Admin';

      if (!user.password && user.phone) {
        user.password = await bcrypt.hash(user.phone.trim(), 10);
      }
      generatedPassword = user.phone || 'Your registered mobile number';
    }

    if (app.addedByCoordinator) {
      user.addedByCoordinator = app.addedByCoordinator;
      user.addedByCoordinatorName = app.coordinatorName || '';
      try {
        await userRepository.updateById(app.addedByCoordinator, {
          $inc: { coordinatorRecruitsCount: 1 }
        });
      } catch (e) {
        console.warn('Coordinator recruit increment warning:', e.message);
      }
    }

    const qrData = `https://bharatiyayuvakranti.org/verify/member/${verifiedMemberId}`;
    try {
      user.qrCodeUrl = await QRCode.toDataURL(qrData);
    } catch (e) {
      user.qrCodeUrl = '';
    }
    await user.save();

    app.status = 'approved';
    app.assignedMemberId = verifiedMemberId;
    app.reviewedBy = adminUser?.name || 'Trustee Admin';
    app.reviewedAt = new Date();
    await app.save();

    // Auto send official appointment letter, ID card & login credentials via email asynchronously
    try {
      const emailPayload = user.toObject ? user.toObject() : { ...user };
      if (generatedPassword) {
        emailPayload.temporaryPassword = generatedPassword;
      }
      sendMembershipApprovalEmail(emailPayload).catch(e => {
        console.warn('Membership approval email send warning:', e.message);
      });
    } catch (e) {
      console.warn('Membership approval email dispatch prep warning:', e.message);
    }

    return { application: app, user, temporaryPassword: generatedPassword };
  }

  async rejectMembershipApplication(appId, reason, adminUser) {
    const app = await applicationRepository.findMembershipAppById(appId);
    if (!app) throw new Error('Membership application not found');

    app.status = 'rejected';
    app.rejectionReason = reason || 'Payment proof verification failed';
    app.reviewedBy = adminUser?.name || 'Trustee Admin';
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
      user = await userRepository.findByEmail(app.email.toLowerCase().trim());
    }

    const verifiedVolId = (user && user.volunteerId) || await this.generateUniqueVolunteerId();
    let generatedPassword = null;
    const isGuest = Boolean(app.isGuest || !app.user || !app.userId);

    if (!user) {
      // Auto-create new User account for volunteer applicant
      const tempPass = app.phone ? app.phone.trim() : ('BYK@' + Math.floor(100000 + Math.random() * 900000));
      const hashedPassword = await bcrypt.hash(tempPass, 10);
      generatedPassword = tempPass;

      user = await userRepository.create({
        name: app.name || 'Valued Volunteer',
        email: app.email ? app.email.toLowerCase().trim() : undefined,
        phone: app.phone ? app.phone.trim() : '9999999999',
        password: hashedPassword,
        role: 'Volunteer',
        status: 'active',
        isVolunteer: true,
        volunteerId: verifiedVolId,
        volunteerWing: 'Active Grassroots Youth Volunteer',
        volunteerStatus: 'active',
        designation: 'Active Volunteer (Youth Wing)',
        bloodGroup: app.bloodGroup || 'O+',
        dob: app.dob || '2000-01-01',
        address: app.address || '',
        district: app.district || 'Aligarh',
        state: app.state || 'Uttar Pradesh',
        photoUrl: app.photoUrl || '',
        documentType: app.documentType || '',
        documentFront: app.documentFront || app.idProofUrl || '',
        documentBack: app.documentBack || '',
        feePaid: true,
        feeAmount: 0,
        idCardGenerated: true,
        appointmentLetterGenerated: true,
        verifiedAt: new Date(),
        verifiedBy: adminUser?.name || 'Trustee Admin'
      });

      app.user = user._id;
      app.userId = user._id;
    } else {
      user.status = 'active';
      user.role = 'Volunteer';
      user.isVolunteer = true;
      user.volunteerId = verifiedVolId;
      if (user.memberId && user.memberId.startsWith('BYK-DON-')) {
        user.memberId = undefined;
      }
      user.designation = 'Active Volunteer (Youth Wing)';
      if (app.photoUrl && !user.photoUrl) user.photoUrl = app.photoUrl;
      if (app.documentType) user.documentType = app.documentType;
      if (app.documentFront) user.documentFront = app.documentFront;
      if (app.documentBack) user.documentBack = app.documentBack;
      user.idCardGenerated = true;
      user.appointmentLetterGenerated = true;
      user.verifiedAt = new Date();
      user.verifiedBy = adminUser?.name || 'Trustee Admin';

      if (!user.password && user.phone) {
        user.password = await bcrypt.hash(user.phone.trim(), 10);
      }
      generatedPassword = user.phone || 'Your registered mobile number';
    }

    const qrData = `https://bharatiyayuvakranti.org/verify/volunteer/${verifiedVolId}`;
    try {
      user.qrCodeUrl = await QRCode.toDataURL(qrData);
    } catch (e) {
      user.qrCodeUrl = '';
    }
    await user.save();

    app.status = 'approved';
    app.assignedVolunteerId = verifiedVolId;
    app.reviewedBy = adminUser?.name || 'Trustee Admin';
    app.reviewedAt = new Date();
    await app.save();

    // Auto send official offer letter, badge & login credentials via email asynchronously
    try {
      const emailPayload = user.toObject ? user.toObject() : { ...user };
      if (generatedPassword) {
        emailPayload.temporaryPassword = generatedPassword;
      }
      sendVolunteerApprovalEmail(emailPayload).catch(e => {
        console.warn('Volunteer approval email send warning:', e.message);
      });
    } catch (e) {
      console.warn('Volunteer approval email dispatch prep warning:', e.message);
    }

    return { application: app, user, temporaryPassword: generatedPassword };
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
