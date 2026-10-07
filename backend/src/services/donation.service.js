const donationRepository = require('../repository/donation.repository');
const categoryRepository = require('../repository/category.repository');
const AppError = require('../utils/AppError');

class DonationService {
  /**
   * Create a new donation
   * @param {string} donorId
   * @param {object} payload
   * @returns {Promise<Document>}
   */
  async createDonation(donorId, payload) {
    const {
      title,
      categoryId,
      quantity,
      unit,
      description,
      location,
      availableFrom,
      availableUntil,
      foodDetails,
      images
    } = payload;

    // 1. Validate Category existence & status
    const category = await categoryRepository.findById(categoryId);
    if (!category) {
      throw new AppError('Selected category does not exist', 404);
    }
    if (category.status !== 'active') {
      throw new AppError('Selected category is currently inactive', 400);
    }

    // 2. Validate availability timeframe
    const fromDate = new Date(availableFrom);
    const untilDate = new Date(availableUntil);

    if (isNaN(fromDate.getTime()) || isNaN(untilDate.getTime())) {
      throw new AppError('Valid availableFrom and availableUntil dates are required', 400);
    }

    if (untilDate <= fromDate) {
      throw new AppError('Available until date/time must be after available from date/time', 400);
    }

    // 3. Food safety check (Per SAHARA spec: store Prepared On and Safe Until; unsafe food must not be distributed)
    const isFoodCategory = category.name.toLowerCase().includes('food');
    let formattedFoodDetails = null;

    if (isFoodCategory || foodDetails) {
      const now = new Date();
      const safeUntil = foodDetails?.safeUntil ? new Date(foodDetails.safeUntil) : null;
      const preparedOn = foodDetails?.preparedOn ? new Date(foodDetails.preparedOn) : null;

      if (safeUntil && safeUntil < now) {
        throw new AppError('Food item has already passed its safe-until consumption time and cannot be distributed', 400);
      }

      if (safeUntil && preparedOn && safeUntil < preparedOn) {
        throw new AppError('Safe until date cannot be earlier than prepared on date', 400);
      }

      formattedFoodDetails = {
        preparedOn: preparedOn || null,
        safeUntil: safeUntil || null,
        isVeg: foodDetails?.isVeg !== undefined ? Boolean(foodDetails.isVeg) : true
      };
    }

    // 4. Construct donation document
    const donationData = {
      donorId,
      title: title.trim(),
      categoryId,
      quantity: Number(quantity),
      unit: unit.trim(),
      description: description?.trim() || '',
      location: {
        address: location?.address?.trim() || '',
        city: location?.city?.trim() || '',
        state: location?.state?.trim() || '',
        pincode: location?.pincode?.trim() || '',
        coordinates: {
          lat: location?.coordinates?.lat ?? null,
          lng: location?.coordinates?.lng ?? null
        }
      },
      availableFrom: fromDate,
      availableUntil: untilDate,
      foodDetails: formattedFoodDetails,
      images: Array.isArray(images) ? images : [],
      status: 'available'
    };

    const newDonation = await donationRepository.create(donationData);
    return await donationRepository.findById(newDonation._id);
  }

  /**
   * Get all donations created by the authenticated donor
   * @param {string} donorId
   * @param {object} query
   * @returns {Promise<Array>}
   */
  async getMyDonations(donorId, query = {}) {
    const filter = {};
    if (query.status) {
      filter.status = query.status;
    }
    if (query.categoryId) {
      filter.categoryId = query.categoryId;
    }

    return await donationRepository.findByDonorId(donorId, filter);
  }

  /**
   * Get public or filtered donations
   * @param {object} query
   * @returns {Promise<{donations: Array, total: number, page: number, limit: number}>}
   */
  async getAllDonations(query = {}) {
    const filter = {};

    // By default, show 'available' donations to public/receivers unless specified
    if (query.status) {
      filter.status = query.status;
    } else {
      filter.status = 'available';
    }

    if (query.categoryId) {
      filter.categoryId = query.categoryId;
    }

    if (query.city) {
      filter['location.city'] = { $regex: new RegExp(`^${query.city.trim()}$`, 'i') };
    }

    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const [donations, total] = await Promise.all([
      donationRepository.findAll(filter, { createdAt: -1 }, skip, limit),
      donationRepository.count(filter)
    ]);

    return {
      donations,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  /**
   * Get single donation details by ID
   * @param {string} donationId
   * @returns {Promise<Document>}
   */
  async getDonationById(donationId) {
    const donation = await donationRepository.findById(donationId);
    if (!donation) {
      throw new AppError('Donation not found', 404);
    }
    return donation;
  }

  /**
   * Update donation details or status
   * @param {string} donationId
   * @param {string} userId
   * @param {string} userRole
   * @param {object} updateData
   * @returns {Promise<Document>}
   */
  async updateDonation(donationId, userId, userRole, updateData) {
    const donation = await donationRepository.findById(donationId);
    if (!donation) {
      throw new AppError('Donation not found', 404);
    }

    const isOwner = donation.donorId && donation.donorId._id.toString() === userId.toString();
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('You are not authorized to update this donation', 403);
    }

    // Do not allow editing critical fields if already in transit or completed
    if (['in_transit', 'completed'].includes(donation.status) && !isAdmin) {
      throw new AppError(`Cannot modify a donation that is already ${donation.status}`, 400);
    }

    return await donationRepository.updateById(donationId, updateData);
  }

  /**
   * Delete / Cancel a donation
   * @param {string} donationId
   * @param {string} userId
   * @param {string} userRole
   * @returns {Promise<Document>}
   */
  async deleteDonation(donationId, userId, userRole) {
    const donation = await donationRepository.findById(donationId);
    if (!donation) {
      throw new AppError('Donation not found', 404);
    }

    const isOwner = donation.donorId && donation.donorId._id.toString() === userId.toString();
    const isAdmin = userRole === 'admin';

    if (!isOwner && !isAdmin) {
      throw new AppError('You are not authorized to delete this donation', 403);
    }

    if (!['available', 'cancelled'].includes(donation.status) && !isAdmin) {
      throw new AppError(`Cannot delete donation while it is ${donation.status}. Please cancel handover/match first.`, 400);
    }

    return await donationRepository.deleteById(donationId);
  }

  /**
   * Get comprehensive dashboard metrics for a donor
   * @param {string} donorId
   * @returns {Promise<object>}
   */
  async getDonorDashboard(donorId) {
    const [statsResult, recentDonations] = await Promise.all([
      donationRepository.getDonorStats(donorId),
      donationRepository.findByDonorId(donorId, {}, { createdAt: -1 })
    ]);

    const { statusCounts, categoryBreakdown } = statsResult;

    let totalDonations = 0;
    let availableCount = 0;
    let inProgressCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;
    let totalItemsDonated = 0;

    statusCounts.forEach((s) => {
      totalDonations += s.count;
      totalItemsDonated += s.totalQuantity || 0;

      if (s._id === 'available') {
        availableCount = s.count;
      } else if (['matched', 'accepted', 'in_transit'].includes(s._id)) {
        inProgressCount += s.count;
      } else if (s._id === 'completed') {
        completedCount = s.count;
      } else if (s._id === 'cancelled') {
        cancelledCount = s.count;
      }
    });

    const estimatedPeopleImpacted = completedCount > 0 ? Math.round(totalItemsDonated * 1.5) : 0;

    return {
      stats: {
        totalDonations,
        availableCount,
        inProgressCount,
        completedCount,
        cancelledCount,
        totalItemsDonated,
        estimatedPeopleImpacted
      },
      categoryDistribution: categoryBreakdown,
      recentDonations: recentDonations.slice(0, 5)
    };
  }
}

module.exports = new DonationService();
