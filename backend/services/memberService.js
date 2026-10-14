const xlsx = require('xlsx');
const QRCode = require('qrcode');
const userRepository = require('../repositories/userRepository');

class MemberService {
  async getMembers(filters = {}) {
    const { role, status, search } = filters;
    const query = {};

    if (role) query.role = role;
    if (status) query.status = status;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { email: regex }, { phone: regex }, { memberId: regex }];
    }

    return userRepository.find(query);
  }

  async updateMemberStatus(id, status) {
    const user = await userRepository.updateById(id, { status });
    if (!user) throw new Error('Member not found');
    const { password: _, ...userSafe } = user.toObject();
    return userSafe;
  }

  async verifyMember(id, verificationData) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('Member not found');

    const { feePaid, feeAmount, designation } = verificationData;
    user.status = 'active';
    if (feePaid !== undefined) user.feePaid = feePaid;
    if (feeAmount !== undefined) user.feeAmount = Number(feeAmount);
    if (designation) user.designation = designation;
    user.idCardGenerated = true;
    user.appointmentLetterGenerated = true;

    const qrData = `https://bharatiyayuvakranti.org/verify/member/${user.memberId}`;
    user.qrCodeUrl = await QRCode.toDataURL(qrData);
    await user.save();

    const { password: _, ...userSafe } = user.toObject();
    return userSafe;
  }

  async exportMembersExcel() {
    const users = await userRepository.find();
    const data = users.map(u => ({
      'Member ID': u.memberId || 'Pending Assignment',
      'Full Name': u.name,
      'Phone': u.phone,
      'Email': u.email,
      'Designation': u.designation,
      'Role': u.role,
      'Status': u.status,
      'Blood Group': u.bloodGroup,
      'DOB': u.dob,
      'Membership Fee Paid': u.feePaid ? 'Yes' : 'No',
      'Fee Amount (INR)': u.feeAmount,
      'Referral Code': u.referralCode || '-',
      'Referred By': u.referredBy || 'Direct',
      'Registration Date': new Date(u.createdAt).toLocaleDateString('en-US')
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Members');
    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  async verifyPublicMember(id) {
    const user = await userRepository.findByMemberId(id) || (id.match(/^[0-9a-fA-F]{24}$/) ? await userRepository.findById(id) : null);
    if (!user) {
      throw new Error('Invalid Member Verification ID!');
    }

    return {
      name: user.name,
      memberId: user.memberId,
      role: user.role,
      designation: user.designation,
      status: user.status,
      bloodGroup: user.bloodGroup,
      state: user.state,
      photoUrl: user.photoUrl,
      verifiedAt: user.verifiedAt || user.createdAt
    };
  }

  async getBirthdayMembers() {
    const today = new Date();
    const currentMonthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const allUsers = await userRepository.find({ status: 'active' });
    const birthdayMembers = allUsers.filter(u => {
      if (!u.dob) return false;
      const parts = u.dob.split('-');
      return parts.length >= 3 && `${parts[1]}-${parts[2]}` === currentMonthDay;
    });

    return {
      todayBirthdays: birthdayMembers,
      candidates: allUsers.slice(0, 10)
    };
  }

  async getCoordinatorReport(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new Error('Coordinator not found');

    const refCode = user.referralCode;
    const referredMembers = await userRepository.find({
      $or: [{ referredBy: refCode }, { referredBy: user.name }]
    });

    return {
      coordinator: {
        name: user.name,
        referralCode: user.referralCode,
        memberId: user.memberId,
        referralUrl: `https://bharatiyayuvakranti.org/volunteer?ref=${user.referralCode}`
      },
      stats: {
        totalReferred: referredMembers.length,
        verifiedMembers: referredMembers.filter(m => m.status === 'active').length,
        pendingMembers: referredMembers.filter(m => m.status === 'pending').length,
        feesCollected: referredMembers.reduce((sum, m) => sum + (m.feePaid ? (m.feeAmount || 0) : 0), 0)
      },
      members: referredMembers
    };
  }

  async getAllCoordinatorsStats() {
    const coordinators = await userRepository.find({
      role: { $in: ['Volunteer', 'TeamMember', 'Admin'] }
    });
    const allUsers = await userRepository.find();

    return coordinators.map(c => {
      const recruits = allUsers.filter(u => u.referredBy === c.referralCode || u.referredBy === c.name);
      return {
        _id: c._id,
        name: c.name,
        phone: c.phone,
        memberId: c.memberId,
        referralCode: c.referralCode,
        role: c.role,
        recruitsCount: recruits.length,
        verifiedRecruits: recruits.filter(r => r.status === 'active').length,
        totalFeesBrought: recruits.reduce((s, r) => s + (r.feePaid ? (r.feeAmount || 0) : 0), 0)
      };
    }).sort((a, b) => b.recruitsCount - a.recruitsCount);
  }

  async deleteMember(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('Member not found');
    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(user);
    return userRepository.deleteById(id);
  }
}

module.exports = new MemberService();
