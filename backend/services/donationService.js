const xlsx = require('xlsx');
const donationRepository = require('../repositories/donationRepository');
const Campaign = require('../models/Campaign');
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

    const finalName = (donorName || '').trim();
    const finalEmail = (email || donationData.donorEmail || '').toLowerCase().trim();
    const finalPhone = (phone || donationData.donorPhone || '').trim();
    const finalPan = (pan || donationData.panNumber || '').toUpperCase().trim();

    if (!amount || !finalName || !finalEmail) {
      throw new Error('Amount, donor name, and email are required');
    }

    let finalCampaignTitle = campaignTitle || donationData.campaignTitle || '';
    let finalCampaignId = donationData.campaignId || 'general';

    // Verify and synchronize campaign title with database if valid ObjectId is provided
    if (finalCampaignId && finalCampaignId !== 'general' && /^[0-9a-fA-F]{24}$/.test(String(finalCampaignId))) {
      try {
        const matchedCampaign = await Campaign.findById(finalCampaignId);
        if (matchedCampaign) {
          finalCampaignTitle = matchedCampaign.title;
        }
      } catch (e) {
        // Fallback to provided title
      }
    }
    if (!finalCampaignTitle) {
      finalCampaignTitle = 'General NGO Social Welfare Fund';
    }

    const donation = await donationRepository.create({
      donor: donorUserId || null,
      donorName: finalName,
      donorEmail: finalEmail,
      donorPhone: finalPhone,
      panNumber: finalPan,
      address: address || '',
      amount: Number(amount),
      campaignId: finalCampaignId,
      campaignTitle: finalCampaignTitle,
      orderId: orderId || `BYK-ORD-${Date.now()}`,
      transactionId: transactionId || donationData.transactionId || '',
      paymentId: donationData.paymentId || '',
      paymentMethod: donationData.paymentMethod || 'UPI',
      paymentScreenshot: paymentScreenshot || '',
      status: 'pending'
    });

    return donation;
  }

  async getDonations(query = {}) {
    return donationRepository.find(query);
  }

  async generateUniqueReceiptNumber() {
    const currentYear = new Date().getFullYear();
    const prefix = `BYK-80G-${currentYear}-`;

    const existing = await donationRepository.findReceiptsWithPrefix(prefix);

    let maxSeq = 0;
    for (const d of existing) {
      if (d.receiptNumber) {
        const match = d.receiptNumber.match(/(\d+)$/);
        if (match) {
          const num = parseInt(match[1], 10);
          if (!isNaN(num) && num > maxSeq) {
            maxSeq = num;
          }
        }
      }
    }

    let nextSeq = maxSeq + 1;
    let candidate = `${prefix}${String(nextSeq).padStart(4, '0')}`;

    while (await donationRepository.findByReceiptNumber(candidate)) {
      nextSeq++;
      candidate = `${prefix}${String(nextSeq).padStart(4, '0')}`;
    }

    return candidate;
  }

  async approveDonation(donationId, adminUser) {
    const donation = await donationRepository.findById(donationId);
    if (!donation) throw new Error('Donation record not found');

    if (donation.status === 'approved' && donation.receiptNumber) {
      return donation;
    }

    let saved = false;
    let attempts = 0;
    while (!saved && attempts < 5) {
      try {
        const receiptNumber = await this.generateUniqueReceiptNumber();
        donation.status = 'approved';
        donation.receiptNumber = receiptNumber;
        donation.receiptGenerated = true;
        donation.receiptGeneratedAt = new Date();
        donation.approvedBy = adminUser?.name || 'Trustee Admin';
        donation.approvedAt = new Date();
        await donation.save();
        saved = true;
      } catch (err) {
        if (err.code === 11000 && attempts < 4) {
          attempts++;
          continue;
        }
        throw err;
      }
    }

    // Automatically update crowdfunding campaign data upon approval
    try {
      await this.updateCampaignFunding(donation, 1);
    } catch (campErr) {
      console.warn('⚠️ [DONATION APPROVAL] Campaign funding update notice:', campErr.message);
    }

    // Send official 80G tax receipt to donor's email address safely
    try {
      await sendDonationApprovalEmail(donation);
    } catch (emailErr) {
      console.warn('⚠️ [DONATION APPROVAL] Email dispatch notice:', emailErr.message);
    }

    return donation;
  }

  async rejectDonation(donationId, reason, adminUser) {
    const donation = await donationRepository.findById(donationId);
    if (!donation) throw new Error('Donation record not found');

    const wasApproved = donation.status === 'approved';

    donation.status = 'rejected';
    donation.rejectionReason = reason || 'Payment proof verification failed';
    donation.reviewedBy = adminUser?.name || 'Trustee Admin';
    donation.reviewedAt = new Date();
    await donation.save();

    // If an approved donation was rejected, reverse crowdfunding campaign stats
    if (wasApproved) {
      try {
        await this.updateCampaignFunding(donation, -1);
      } catch (campErr) {
        console.warn('⚠️ [DONATION REJECTION] Campaign funding reversal notice:', campErr.message);
      }
    }

    return donation;
  }

  async updateCampaignFunding(donation, multiplier = 1) {
    try {
      if (!donation || !donation.amount) return null;

      const campaignId = donation.campaignId;
      const campaignTitle = (donation.campaignTitle || '').trim();

      // General unrestricted fund is not an individual crowdfunding campaign
      if (campaignId === 'general' && (!campaignTitle || campaignTitle.toLowerCase().includes('general'))) {
        return null;
      }

      let campaign = null;

      // 1. Try finding by MongoDB ObjectId if campaignId is a valid 24-char hex string
      if (campaignId && campaignId !== 'general' && /^[0-9a-fA-F]{24}$/.test(String(campaignId))) {
        campaign = await Campaign.findById(campaignId);
      }

      // 2. Fallback search by campaignTitle (exact or case-insensitive regex)
      if (!campaign && campaignTitle && !campaignTitle.toLowerCase().includes('general')) {
        const escaped = campaignTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        campaign = await Campaign.findOne({
          title: { $regex: new RegExp(`^${escaped}$`, 'i') }
        });
      }

      if (!campaign) {
        return null;
      }

      const amountDiff = Number(donation.amount) * multiplier;
      const countDiff = 1 * multiplier;

      const newRaisedAmount = Math.max(0, Number(campaign.raisedAmount || 0) + amountDiff);
      const newDonorCount = Math.max(0, Number(campaign.donorCount || 0) + countDiff);

      campaign.raisedAmount = newRaisedAmount;
      campaign.donorCount = newDonorCount;

      await campaign.save();
      console.log(`[Campaign Funding Updated] Campaign "${campaign.title}" (${campaign._id}): raised ₹${newRaisedAmount}, donors: ${newDonorCount}`);
      return campaign;
    } catch (err) {
      console.error('[Campaign Funding Error] Failed to update campaign stats:', err.message);
      return null;
    }
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

  async deleteDonation(donationId) {
    const donation = await donationRepository.findById(donationId);
    if (!donation) throw new Error('Donation record not found');

    if (donation.status === 'approved') {
      try {
        await this.updateCampaignFunding(donation, -1);
      } catch (campErr) {
        console.warn('⚠️ [DONATION DELETION] Campaign funding reversal notice:', campErr.message);
      }
    }

    const { deleteDocumentFiles } = require('../utils/fileCleaner');
    await deleteDocumentFiles(donation);
    return donationRepository.deleteById(donationId);
  }
}

module.exports = new DonationService();
