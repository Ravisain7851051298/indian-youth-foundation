const mongoose = require('mongoose');
const User = require('../models/User');
const pdfService = require('../services/pdfService');

/**
 * Resolves a User object from request (params, query, or authenticated user)
 */
async function resolveUserFromReq(req) {
  const targetId = req.params?.id || req.query?.id || req.query?.userId || req.user?.id || req.user?._id;
  if (!targetId) return null;

  let user = null;
  const cleanId = String(targetId).trim();

  if (mongoose.Types.ObjectId.isValid(cleanId)) {
    user = await User.findById(cleanId);
  }
  if (!user) {
    user = await User.findOne({
      $or: [
        { coordinatorId: cleanId },
        { memberId: cleanId },
        { volunteerId: cleanId },
        { email: cleanId.toLowerCase() },
        { phone: cleanId }
      ]
    });
  }
  if (!user && req.user?.id && cleanId !== req.user.id) {
    user = await User.findById(req.user.id);
  }
  return user;
}

/**
 * Ensures user has 10-digit numeric ID assigned for their active role
 */
async function ensureNumericTenDigitId(user, roleType = '') {
  if (!user) return user;
  const isCoord = roleType === 'coordinator' || user.role === 'Coordinator' || user.isCoordinator;
  const isVol = !isCoord && (roleType === 'volunteer' || user.role === 'Volunteer' || user.isVolunteer);

  let modified = false;

  if (isCoord) {
    if (!user.coordinatorId || !/^\d{10}$/.test(user.coordinatorId)) {
      user.coordinatorId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      user.memberId = user.coordinatorId;
      modified = true;
    }
  } else if (isVol) {
    if (!user.volunteerId || !/^\d{10}$/.test(user.volunteerId)) {
      user.volunteerId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      modified = true;
    }
  } else {
    if (!user.memberId || !/^\d{10}$/.test(user.memberId) || user.memberId.startsWith('BYK-DON-')) {
      user.memberId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      modified = true;
    }
  }

  if (modified) {
    try {
      await user.save();
    } catch (e) {
      console.warn('⚠️ Could not save auto-generated 10-digit ID to user:', e.message);
    }
  }
  return user;
}

const downloadIdCardPdf = async (req, res) => {
  try {
    let user = await resolveUserFromReq(req);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User or credentials not found for ID Card generation.' });
    }

    const type = (req.query?.type || req.params?.type || '').toLowerCase();
    user = await ensureNumericTenDigitId(user, type);

    const isCoord = type === 'coordinator' || user.role === 'Coordinator' || user.isCoordinator;
    const isVol = !isCoord && (type === 'volunteer' || user.role === 'Volunteer' || user.isVolunteer);

    let pdfBuffer;
    let cardCode;

    if (isCoord) {
      pdfBuffer = await pdfService.generateCoordinatorIdCardPdf(user);
      cardCode = user.coordinatorId || user.memberId || 'Coordinator';
    } else if (isVol) {
      pdfBuffer = await pdfService.generateVolunteerIdCardPdf(user);
      cardCode = user.volunteerId || 'Volunteer';
    } else {
      pdfBuffer = await pdfService.generateMemberIdCardPdf(user);
      cardCode = user.memberId || 'Member';
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ID_Card_${cardCode}.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating ID card PDF:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const downloadAppointmentLetterPdf = async (req, res) => {
  try {
    let user = await resolveUserFromReq(req);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User or credentials not found for Appointment Letter generation.' });
    }

    const type = (req.query?.type || req.params?.type || '').toLowerCase();
    user = await ensureNumericTenDigitId(user, type);

    const isCoord = type === 'coordinator' || user.role === 'Coordinator' || user.isCoordinator;
    const isVol = !isCoord && (type === 'volunteer' || user.role === 'Volunteer' || user.isVolunteer);

    let pdfBuffer;
    let letterCode;

    if (isCoord) {
      pdfBuffer = await pdfService.generateCoordinatorAppointmentLetterPdf(user);
      letterCode = user.coordinatorId || user.memberId || 'Coordinator';
    } else if (isVol) {
      pdfBuffer = await pdfService.generateVolunteerOfferLetterPdf(user);
      letterCode = user.volunteerId || 'Volunteer';
    } else {
      pdfBuffer = await pdfService.generateAppointmentLetterPdf(user);
      letterCode = user.memberId || 'Member';
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Appointment_Letter_${letterCode}.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating appointment letter PDF:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  downloadIdCardPdf,
  downloadAppointmentLetterPdf
};

