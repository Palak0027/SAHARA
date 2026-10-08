const mongoose = require('mongoose');
const Need = require('../models/Need');

class NeedRepository {
  /**
   * Create and persist a new need request
   * @param {object} needData
   * @returns {Promise<Document>}
   */
  async create(needData) {
    return await Need.create(needData);
  }

  /**
   * Find a need by ID with populated receiver and category
   * @param {string} id
   * @returns {Promise<Document|null>}
   */
  async findById(id) {
    return await Need.findById(id)
      .populate('receiverId', 'name phone email location receiverType organization onBehalfOf')
      .populate('categoryId', 'name description');
  }

  /**
   * Find needs created by a specific receiver
   * @param {string} receiverId
   * @param {object} [additionalFilter]
   * @param {object} [sort]
   * @returns {Promise<Array>}
   */
  async findByReceiverId(receiverId, additionalFilter = {}, sort = { createdAt: -1 }) {
    return await Need.find({ receiverId, ...additionalFilter })
      .populate('categoryId', 'name description')
      .sort(sort);
  }

  /**
   * Find all needs with filters and pagination
   * @param {object} filter
   * @param {object} [sort]
   * @param {number} [skip]
   * @param {number} [limit]
   * @returns {Promise<Array>}
   */
  async findAll(filter = {}, sort = { createdAt: -1 }, skip = 0, limit = 50) {
    return await Need.find(filter)
      .populate('receiverId', 'name city location receiverType')
      .populate('categoryId', 'name description')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  /**
   * Count needs matching filter
   * @param {object} filter
   * @returns {Promise<number>}
   */
  async count(filter = {}) {
    return await Need.countDocuments(filter);
  }

  /**
   * Update a need document by ID
   * @param {string} id
   * @param {object} updateData
   * @returns {Promise<Document|null>}
   */
  async updateById(id, updateData) {
    return await Need.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    })
      .populate('receiverId', 'name phone email location receiverType organization onBehalfOf')
      .populate('categoryId', 'name description');
  }

  /**
   * Delete a need document by ID
   * @param {string} id
   * @returns {Promise<Document|null>}
   */
  async deleteById(id) {
    return await Need.findByIdAndDelete(id);
  }

  /**
   * Aggregate statistics for receiver dashboard
   * @param {string} receiverId
   * @returns {Promise<object>}
   */
  async getReceiverStats(receiverId) {
    const objectReceiverId = new mongoose.Types.ObjectId(receiverId.toString());

    const statusCounts = await Need.aggregate([
      { $match: { receiverId: objectReceiverId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    const urgencyBreakdown = await Need.aggregate([
      { $match: { receiverId: objectReceiverId } },
      {
        $group: {
          _id: '$urgency',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryBreakdown = await Need.aggregate([
      { $match: { receiverId: objectReceiverId } },
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

    return { statusCounts, urgencyBreakdown, categoryBreakdown };
  }
}

module.exports = new NeedRepository();
