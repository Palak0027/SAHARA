const needRepository = require('../repository/need.repository');
const categoryRepository = require('../repository/category.repository');
const AppError = require('../utils/AppError');

class NeedService {
  /**
   * Create a new need request
   * @param {string} receiverId
   * @param {object} userProfile
   * @param {object} payload
   * @returns {Promise<Document>}
   */
  async createNeed(receiverId, userProfile, payload) {
    const {
      title,
      categoryId,
      quantity,
      unit,
      urgency,
      requiredBy,
      description,
      location,
      receiverType,
      onBehalfOf
    } = payload;

    // 1. Validate Category
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new AppError('Selected category does not exist', 404);
    }
    if (category.status !== 'active') {
      throw new AppError('Selected category is currently inactive', 400);
    }

    // 2. Validate requiredBy date
    const reqDate = new Date(requiredBy);
    if (isNaN(reqDate.getTime())) {
      throw new AppError('Valid requiredBy date is required', 400);
    }

    // 3. Configure receiver type & onBehalfOf
    const effectiveReceiverType = receiverType || userProfile?.receiverType || 'individual';

    let formattedOnBehalfOf = { isOnBehalf: false };
    if (onBehalfOf && onBehalfOf.isOnBehalf) {
      formattedOnBehalfOf = {
        isOnBehalf: true,
        beneficiaryName: onBehalfOf.beneficiaryName?.trim() || '',
        beneficiaryAge: Number(onBehalfOf.beneficiaryAge) || null,
        relationship: onBehalfOf.relationship?.trim() || '',
        beneficiaryLocation: onBehalfOf.beneficiaryLocation?.trim() || ''
      };
    } else if (userProfile?.onBehalfOf?.isOnBehalf) {
      formattedOnBehalfOf = userProfile.onBehalfOf;
    }

    // 4. Construct need document
    const needData = {
      receiverId,
      title: title.trim(),
      categoryId,
      quantity: Number(quantity),
      unit: unit.trim(),
      urgency: ['low', 'medium', 'high', 'critical'].includes(urgency) ? urgency : 'medium',
      requiredBy: reqDate,
      description: description.trim(),
      location: {
        address: location?.address?.trim() || userProfile?.location?.address || '',
        city: location?.city?.trim() || userProfile?.location?.city || '',
        state: location?.state?.trim() || userProfile?.location?.state || '',
        pincode: location?.pincode?.trim() || userProfile?.location?.pincode || '',
        coordinates: {
          lat: location?.coordinates?.lat ?? userProfile?.location?.coordinates?.lat ?? null,
          lng: location?.coordinates?.lng ?? userProfile?.location?.coordinates?.lng ?? null
        }
      },
      receiverType: effectiveReceiverType,
      onBehalfOf: formattedOnBehalfOf,
      status: 'open'
    };

    if (!needData.location.address || !needData.location.city) {
      throw new AppError('Delivery address and city are required', 400);
    }

    const newNeed = await needRepository.create(needData);
    return await needRepository.findById(newNeed._id);
  }

  /**
   * Get all needs created by the logged-in receiver
   * @param {string} receiverId
   * @param {object} query
   * @returns {Promise<Array>}
   */
  async getMyNeeds(receiverId, query = {}) {
    const filter = {};
    if (query.status) {
      filter.status = query.status;
    }
    if (query.urgency) {
      filter.urgency = query.urgency;
    }
    if (query.categoryId) {
      filter.categoryId = query.categoryId;
    }

    return await needRepository.findByReceiverId(receiverId, filter);
  }

  /**
   * Get comprehensive dashboard metrics for a receiver
   * @param {string} receiverId
   * @returns {Promise<object>}
   */
  async getReceiverDashboard(receiverId) {
    const [statsResult, recentNeeds] = await Promise.all([
      needRepository.getReceiverStats(receiverId),
      needRepository.findByReceiverId(receiverId, {}, { createdAt: -1 })
    ]);

    const { statusCounts, urgencyBreakdown, categoryBreakdown } = statsResult;

    let totalNeeds = 0;
    let openCount = 0;
    let inProgressCount = 0;
    let fulfilledCount = 0;
    let cancelledCount = 0;
    let totalItemsRequested = 0;

    statusCounts.forEach((s) => {
      totalNeeds += s.count;
      totalItemsRequested += s.totalQuantity || 0;

      if (s._id === 'open') {
        openCount = s.count;
      } else if (['matched', 'accepted', 'in_transit'].includes(s._id)) {
        inProgressCount += s.count;
      } else if (s._id === 'fulfilled') {
        fulfilledCount = s.count;
      } else if (s._id === 'cancelled') {
        cancelledCount = s.count;
      }
    });

    return {
      stats: {
        totalNeeds,
        openCount,
        inProgressCount,
        fulfilledCount,
        cancelledCount,
        totalItemsRequested
      },
      urgencyDistribution: urgencyBreakdown,
      categoryDistribution: categoryBreakdown,
      recentNeeds: recentNeeds.slice(0, 5)
    };
  }

  /**
   * Get public/feed needs for donors or volunteers to browse
   * @param {object} query
   * @returns {Promise<{needs: Array, total: number, page: number, limit: number, totalPages: number}>}
   */
  async getAllNeeds(query = {}) {
    const filter = {};

    if (query.status) {
      filter.status = query.status;
    } else {
      filter.status = 'open';
    }

    if (query.categoryId) {
      filter.categoryId = query.categoryId;
    }

    if (query.urgency) {
      filter.urgency = query.urgency;
    }

    if (query.city) {
      filter['location.city'] = { $regex: new RegExp(`^${query.city.trim()}$`, 'i') };
    }

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [needs, total] = await Promise.all([
      needRepository.findAll(filter, { createdAt: -1 }, skip, limit),
      needRepository.count(filter)
    ]);

    return {
      needs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Get single need details by ID
   * @param {string} needId
   * @returns {Promise<Document>}
   */
  async getNeedById(needId) {
    const need = await needRepository.findById(needId);
    if (!need) {
      throw new AppError('Need request not found', 404);
    }
    return need;
  }

  /**
   * Update need request details or status
   * @param {string} needId
   * @param {string} userId
   * @param {string} userRole
   * @param {object} updateData
   * @returns {Promise<Document>}
   */
  async updateNeed(needId, userId, userRole, updateData) {
    const need = await needRepository.findById(needId);
    if (!need) {
      throw new AppError('Need request not found', 404);
    }

    const isOwner = need.receiverId && need.receiverId._id.toString() === userId.toString();
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('You are not authorized to update this request', 403);
    }

    if (['in_transit', 'fulfilled'].includes(need.status) && !isAdmin) {
      throw new AppError(`Cannot modify a need request that is already ${need.status}`, 400);
    }

    return await needRepository.updateById(needId, updateData);
  }

  /**
   * Delete or cancel a need request
   * @param {string} needId
   * @param {string} userId
   * @param {string} userRole
   * @returns {Promise<Document>}
   */
  async deleteNeed(needId, userId, userRole) {
    const need = await needRepository.findById(needId);
    if (!need) {
      throw new AppError('Need request not found', 404);
    }

    const isOwner = need.receiverId && need.receiverId._id.toString() === userId.toString();
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('You are not authorized to delete this request', 403);
    }

    if (!['open', 'cancelled'].includes(need.status) && !isAdmin) {
      throw new AppError(`Cannot delete need request while it is ${need.status}`, 400);
    }

    return await needRepository.deleteById(needId);
  }
}

module.exports = new NeedService();
