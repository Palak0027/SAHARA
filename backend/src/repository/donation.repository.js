const Donation = require('../models/Donation');

class DonationRepository {
  /**
   * Create and persist a new donation document
   * @param {object} donationData
   * @returns {Promise<Document>}
   */
  async create(donationData) {
    return await Donation.create(donationData);
  }

  /**
   * Find a donation by ID with populated donor and category
   * @param {string} id
   * @returns {Promise<Document|null>}
   */
  async findById(id) {
    return await Donation.findById(id)
      .populate('donorId', 'name phone email location')
      .populate('categoryId', 'name description');
  }

  /**
   * Find donations created by a specific donor
   * @param {string} donorId
   * @param {object} [additionalFilter]
   * @param {object} [sort]
   * @returns {Promise<Array>}
   */
  async findByDonorId(donorId, additionalFilter = {}, sort = { createdAt: -1 }) {
    return await Donation.find({ donorId, ...additionalFilter })
      .populate('categoryId', 'name description')
      .sort(sort);
  }

  /**
   * Find all donations with filters and optional pagination
   * @param {object} filter
   * @param {object} [sort]
   * @param {number} [skip]
   * @param {number} [limit]
   * @returns {Promise<Array>}
   */
  async findAll(filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 50) {
    return await Donation.find(filter)
      .populate('donorId', 'name city location')
      .populate('categoryId', 'name description')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  /**
   * Count documents matching filter
   * @param {object} filter
   * @returns {Promise<number>}
   */
  async count(filter = {}) {
    return await Donation.countDocuments(filter);
  }

  /**
   * Update a donation document by ID
   * @param {string} id
   * @param {object} updateData
   * @returns {Promise<Document|null>}
   */
  async updateById(id, updateData) {
    return await Donation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })
      .populate('donorId', 'name phone email location')
      .populate('categoryId', 'name description');
  }

  /**
   * Delete a donation document by ID
   * @param {string} id
   * @returns {Promise<Document|null>}
   */
  async deleteById(id) {
    return await Donation.findByIdAndDelete(id);
  }

  /**
   * Aggregate statistics and category distribution for a specific donor
   * @param {string} donorId
   * @returns {Promise<object>}
   */
  async getDonorStats(donorId) {
    const mongoose = require('mongoose');
    const objectDonorId = new mongoose.Types.ObjectId(donorId.toString());

    const statusCounts = await Donation.aggregate([
      { $match: { donorId: objectDonorId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    const categoryBreakdown = await Donation.aggregate([
      { $match: { donorId: objectDonorId } },
      {
        $group: {
          _id: '$categoryId',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          categoryId: '$_id',
          categoryName: { $ifNull: ['$category.name', 'Other'] },
          count: 1,
          totalQuantity: 1
        }
      }
    ]);

    return { statusCounts, categoryBreakdown };
  }
}

module.exports = new DonationRepository();
