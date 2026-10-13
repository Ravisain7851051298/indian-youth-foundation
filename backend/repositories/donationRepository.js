const Donation = require('../models/Donation');

class DonationRepository {
  async create(donationData) {
    const donation = new Donation(donationData);
    return donation.save();
  }

  async findById(id) {
    return Donation.findById(id).populate('donor');
  }

  async findByOrderId(orderId) {
    return Donation.findOne({ orderId });
  }

  async findByReceiptNumber(receiptNumber) {
    return Donation.findOne({ receiptNumber });
  }

  async find(query = {}, sort = { createdAt: -1 }) {
    return Donation.find(query).populate('donor').sort(sort);
  }

  async updateById(id, updateData) {
    return Donation.findByIdAndUpdate(id, updateData, { new: true });
  }

  async count(query = {}) {
    return Donation.countDocuments(query);
  }

  async aggregateTotal(match = { status: 'approved' }) {
    const result = await Donation.aggregate([
      { $match: match },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
    ]);
    return result[0]?.totalAmount || 0;
  }
}

module.exports = new DonationRepository();
