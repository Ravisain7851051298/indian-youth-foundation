const QRCode = require('qrcode');
const bcrypt = require('bcryptjs');
const applicationRepository = require('../repositories/applicationRepository');
const userRepository = require('../repositories/userRepository');
const planRepository = require('../repositories/planRepository');
const { sendMembershipApprovalEmail, sendVolunteerApprovalEmail } = require('./emailService');

class ApplicationService {
  async applyMembership(submitterParam, appData) {
    let submitter = null;
    if (submitterParam && typeof submitterParam === 'object' && submitterParam._id) {
      submitter = submitterParam;
    } else if (submitterParam && typeof submitterParam === 'string') {
      submitter = await userRepository.findById(submitterParam);
    }

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

    const cleanEmail = email && typeof email === 'string' && email.trim() ? email.toLowerCase().trim() : undefined;
    const cleanPhone = (phone || '').trim();
    const cleanName = (name || '').trim();

    if (!cleanName || !cleanPhone) {
      throw new Error('Please provide Full Legal Name and Mobile Number for membership enrollment.');
    }

    // RESOLVE APPLICANT USER RECORD:
    // Lookup solely by applicant's phone or email - NEVER attach the logged-in admin or other submitter!
    let user = null;
    if (cleanPhone) {
      user = await userRepository.findByPhone(cleanPhone);
    }
    if (!user && cleanEmail) {
      user = await userRepository.findByEmail(cleanEmail);
    }

    const isAdminAccount = user && user.role === 'Admin';

    // Generate 4-digit random password PIN for applicant
    const generatedPassword = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    if (!user || isAdminAccount) {
      const assignedMemberId = await this.generateUniqueMemberId();

      const userCreateData = {
        name: cleanName,
        phone: isAdminAccount ? `${cleanPhone}_mem` : cleanPhone,
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
        notes: 'Created via Membership Application'
      };

      if (cleanEmail && !isAdminAccount) {
        userCreateData.email = cleanEmail;
      }

      if (submitter) {
        userCreateData.addedByCoordinator = submitter._id || submitter.id;
        userCreateData.addedByCoordinatorName = submitter.name || '';
      } else if (addedByCoordinator) {
        userCreateData.addedByCoordinator = addedByCoordinator;
        userCreateData.addedByCoordinatorName = coordinatorName || '';
      }

      user = await userRepository.create(userCreateData);
    } else {
      // Update existing user record with additional application info (NOT Admin)
      if (!user.memberId || !/^\d{10}$/.test(user.memberId)) {
        user.memberId = await this.generateUniqueMemberId();
      }
      user.password = hashedPassword;
      if (cleanEmail) {
        user.email = cleanEmail;
      }
      if (cleanName) user.name = cleanName;
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

    const effectiveSubmitterId = submitter ? (submitter._id || submitter.id) : (addedByCoordinator || null);
    const effectiveSubmitterName = submitter ? (submitter.name || '') : (coordinatorName || '');
    const effectiveSubmitterRole = submitter ? (submitter.role || '') : (addedByRole || '');

    const application = await applicationRepository.createMembershipApp({
      user: user._id,
      userId: user._id,
      isGuest: !submitter,
      name: cleanName,
      email: cleanEmail || '', // Never fallback to submitter/admin email!
      phone: cleanPhone,
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
      addedByCoordinator: effectiveSubmitterId,
      coordinatorName: effectiveSubmitterName,
      coordinatorId: coordinatorId || '',
      addedByRole: effectiveSubmitterRole,
      status: 'pending'
    });

    return {
      application,
      credentials: {
        id: user.memberId,
        password: generatedPassword,
        email: cleanEmail || '',
        name: cleanName,
        role: 'Member'
      }
    };
  }

  async applyVolunteer(submitterParam, appData) {
    let submitter = null;
    if (submitterParam && typeof submitterParam === 'object' && submitterParam._id) {
      submitter = submitterParam;
    } else if (submitterParam && typeof submitterParam === 'string') {
      submitter = await userRepository.findById(submitterParam);
    }

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

    const cleanEmail = email && typeof email === 'string' && email.trim() ? email.toLowerCase().trim() : undefined;
    const cleanPhone = (phone || '').trim();
    const cleanName = (name || '').trim();

    if (!cleanName || !cleanPhone) {
      throw new Error('Please provide Full Legal Name and Mobile Number for volunteer enrollment.');
    }

    // RESOLVE APPLICANT USER RECORD:
    // Lookup solely by applicant's phone or email - NEVER attach the logged-in admin or other submitter!
    let user = null;
    if (cleanPhone) {
      user = await userRepository.findByPhone(cleanPhone);
    }
    if (!user && cleanEmail) {
      user = await userRepository.findByEmail(cleanEmail);
    }

    const isAdminAccount = user && user.role === 'Admin';

    // Generate 4-digit random password PIN for volunteer applicant
    const generatedPassword = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    if (!user || isAdminAccount) {
      const assignedVolunteerId = await this.generateUniqueVolunteerId();

      const userCreateData = {
        name: cleanName,
        phone: isAdminAccount ? `${cleanPhone}_vol` : cleanPhone,
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
        documentType: finalDocType || 'Aadhaar Card',
        documentFront: finalDocFront || '',
        documentBack: finalDocBack || '',
        feePaid: true,
        feeAmount: 0,
        notes: 'Created via Volunteer Application'
      };

      if (cleanEmail && !isAdminAccount) {
        userCreateData.email = cleanEmail;
      }

      if (submitter) {
        userCreateData.addedByCoordinator = submitter._id || submitter.id;
        userCreateData.addedByCoordinatorName = submitter.name || '';
      }

      user = await userRepository.create(userCreateData);
    } else {
      // Update existing user record with volunteer details (NOT Admin)
      if (!user.volunteerId || !/^\d{10}$/.test(user.volunteerId)) {
        user.volunteerId = await this.generateUniqueVolunteerId();
      }
      user.password = hashedPassword;
      if (cleanEmail) {
        user.email = cleanEmail;
      }
      if (cleanName) user.name = cleanName;
      if (bloodGroup) user.bloodGroup = bloodGroup;
      if (dob) user.dob = dob;
      if (address) user.address = address;
      if (district) user.district = district;
      if (state) user.state = state;
      if (finalPhoto) user.photoUrl = finalPhoto;
      if (finalDocType) user.documentType = finalDocType;
      if (finalDocFront) user.documentFront = finalDocFront;
      if (finalDocBack) user.documentBack = finalDocBack;
      user.isVolunteer = true;
      if (user.status !== 'active') user.status = 'pending';
      await user.save();
    }

    const application = await applicationRepository.createVolunteerApp({
      user: user._id,
      userId: user._id,
      isGuest: !submitter,
      name: cleanName,
      email: cleanEmail || '', // If blank, keep blank! Never fallback to submitter/admin!
      phone: cleanPhone,
      skills: Array.isArray(skills) ? skills : [skills || 'Community Outreach'],
      availability: availability || 'Weekends',
      interests: appData.interests || '',
      documentType: finalDocType || 'Aadhaar Card',
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
        password: generatedPassword,
        email: cleanEmail || '',
        name: cleanName,
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
    let candidate;
    let exists = true;
    while (exists) {
      // 10-digit random number between 1000000000 and 9999999999
      candidate = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const existing = await userRepository.findByMemberId(candidate);
      if (!existing) exists = false;
    }
    return candidate;
  }

  async generateUniqueVolunteerId() {
    let candidate;
    let exists = true;
    while (exists) {
      // 10-digit random number between 1000000000 and 9999999999
      candidate = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const existing = await userRepository.findByVolunteerId(candidate);
      if (!existing) exists = false;
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
    const verifiedMemberId = (user && user.memberId && /^\d{10}$/.test(user.memberId))
      ? user.memberId
      : await this.generateUniqueMemberId();
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
      if (user.role !== 'Admin') {
        user.status = 'rejected';
      }
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

    const verifiedVolId = (user && user.volunteerId && /^\d{10}$/.test(user.volunteerId))
      ? user.volunteerId
      : await this.generateUniqueVolunteerId();
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

    const userId = app.user?._id || app.user || app.userId;
    let user = userId ? await userRepository.findById(userId) : null;
    if (!user && app.email) {
      user = await userRepository.findByEmail(app.email);
    }
    if (user) {
      if (user.role !== 'Admin') {
        user.status = 'rejected';
      }
      user.volunteerStatus = 'rejected';
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
