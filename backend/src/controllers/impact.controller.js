const donationRepository = require('../repository/donation.repository');
const Donation = require('../models/Donation');
const User = require('../models/User');

/**
 * @desc    Get personal impact metrics for the logged-in donor
 * @route   GET /api/impact/me
 * @access  Private
 */
const getMyImpact = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { statusCounts, categoryBreakdown } = await donationRepository.getDonorStats(userId);

    let totalDonations = 0;
    let completedCount = 0;
    let totalQuantity = 0;

    statusCounts.forEach((s) => {
      totalDonations += s.count;
      totalQuantity += s.totalQuantity || 0;
      if (s._id === 'completed') {
        completedCount = s.count;
      }
    });

    const mealsServed = completedCount * 10;
    const peopleHelped = completedCount > 0 ? Math.round(totalQuantity * 1.5) : 0;

    return res.status(200).json({
      success: true,
      impact: {
        totalDonations,
        completedDonations: completedCount,
        totalQuantityDonated: totalQuantity,
        peopleHelped,
        mealsServed,
        categoryBreakdown
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get platform-wide public impact metrics
 * @route   GET /api/impact
 * @access  Public
 */
const getGlobalImpact = async (req, res, next) => {
  try {
    const [totalDonations, completedDonations, totalDonors, citiesCount] = await Promise.all([
      Donation.countDocuments(),
      Donation.countDocuments({ status: 'completed' }),
      User.countDocuments({ role: 'donor' }),
      Donation.distinct('location.city')
    ]);

    return res.status(200).json({
      success: true,
      impact: {
        totalDonations,
        completedDonations,
        totalDonors,
        citiesReached: citiesCount.length || 1,
        totalLivesImpacted: Math.max(completedDonations * 4, 0)
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyImpact,
  getGlobalImpact
};
