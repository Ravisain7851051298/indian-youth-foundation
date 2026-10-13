const xlsx = require('xlsx');
const donationRepository = require('../repositories/donationRepository');
const { sendDonationApprovalEmail } = require('./emailService');

class DonationService {
  async createDonationOrder(orderData) {
    const { amount, donorName, email, phone, pan, address, campaignTitle } = orderData;
    if (!amount || amount < 10) throw new Error('Valid donation amount of at least ₹10 is required');
    if (!donorName || !email || !phone) throw new Error('Full Name, Email, and Phone number are required');

    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    return {
      orderId,
      amount,
      currency: 'INR',
      donorName,
      email,
      phone,
      pan: pan || '',
      address: address || '',
      campaignTitle: campaignTitle || 'General Youth Welfare & Education Fund'
    };
  }

  async submitDonation(donationData, donorUserId) {
    const {
      amount, donorName, email, phone, pan, address, campaignTitle,
      orderId, transactionId, paymentScreenshot
    } = donationData;

    if (!amount || !donorName || !email) {
      throw new Error('Amount, donor name, and email are required');
    }

    const donation = await donationRepository.create({
      donor: donorUserId || null,
      donorName,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      pan: pan ? pan.toUpperCase().trim() : '',
      address: address || '',
      amount: Number(amount),
      campaignTitle: campaignTitle || 'General Welfare Fund',
      orderId: orderId || `BYK-ORD-${Date.now()}`,
      transactionId: transactionId || `BYK-UTR-${Date.now()}`,
      paymentScreenshot: paymentScreenshot || '',
      status: 'pending',
      receiptNumber: null,
      receiptGenerated: false
    });

    return donation;
  }

  async getDonations(query = {}) {
    return donationRepository.find(query);
  }

  async approveDonation(donationId, adminUser) {
    const donation = await donationRepository.findById(donationId);
    if (!donation) throw new Error('Donation record not found');

    const approvedCount = await donationRepository.count({ status: 'approved' });
    const receiptNumber = `BYK-80G-2026-${String(approvedCount + 1).padStart(4, '0')}`;

    donation.status = 'approved';
    donation.receiptNumber = receiptNumber;
    donation.receiptGenerated = true;
    donation.receiptGeneratedAt = new Date();
    donation.approvedBy = adminUser.name || 'Trustee Admin';
    donation.approvedAt = new Date();
    await donation.save();

    // Send official 80G tax receipt to donor's email address
    await sendDonationApprovalEmail(donation);

    return donation;
  }

  async rejectDonation(donationId, reason, adminUser) {
    const donation = await donationRepository.findById(donationId);
    if (!donation) throw new Error('Donation record not found');

    donation.status = 'rejected';
    donation.rejectionReason = reason || 'Payment proof verification failed';
    donation.reviewedBy = adminUser.name || 'Trustee Admin';
    donation.reviewedAt = new Date();
    await donation.save();

    return donation;
  }

  async verifyPublicDonation(receiptNumber) {
    const donation = await donationRepository.findByReceiptNumber(receiptNumber);
    if (!donation || donation.status !== 'approved') {
      throw new Error('Invalid or unverified donation receipt number');
    }

    return {
      verified: true,
      receiptNumber: donation.receiptNumber,
      donorName: donation.donorName,
      amount: donation.amount,
      campaignTitle: donation.campaignTitle,
      date: donation.createdAt,
      pan: donation.pan ? `${donation.pan.slice(0, 3)}****${donation.pan.slice(-1)}` : 'Not Provided',
      exemptionSection: 'Section 80G of Income Tax Act 1961'
    };
  }

  async exportDonationsExcel() {
    const donations = await donationRepository.find();
    const data = donations.map(d => ({
      'Receipt No': d.receiptNumber || 'Pending Verification',
      'Donor Name': d.donorName,
      'Email': d.email,
      'Phone': d.phone,
      'PAN (80G)': d.pan || '-',
      'Amount (INR)': d.amount,
      'Campaign': d.campaignTitle,
      'Status': d.status,
      'Transaction Ref / UTR': d.transactionId,
      'Date': new Date(d.createdAt).toLocaleDateString('en-US'),
      'Receipt Sent': d.receiptGenerated ? 'Yes' : 'No'
    }));

    const worksheet = xlsx.utils.json_to_sheet(data);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, '80G Donations');
    return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }
}

module.exports = new DonationService();
