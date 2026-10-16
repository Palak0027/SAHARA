const matchService = require('../services/match.service');

/**
 * @desc    Get smart match recommendations for logged-in donor
 * @route   GET /api/matches/donor
 * @access  Private (Donor / Admin)
 */
const getDonorMatches = async (req, res, next) => {
  try {
    const matches = await matchService.getDonorSmartMatches(req.user._id);
    return res.status(200).json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get smart match recommendations for logged-in receiver
 * @route   GET /api/matches/receiver
 * @access  Private (Receiver / Admin)
 */
const getReceiverMatches = async (req, res, next) => {
  try {
    const matches = await matchService.getReceiverSmartMatches(req.user._id);
    return res.status(200).json({
      success: true,
      count: matches.length,
      matches
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Confirm match between a donation and a need with chosen logistics mode
 * @route   POST /api/matches/confirm
 * @access  Private (Donor / Receiver / Admin)
 */
const confirmMatch = async (req, res, next) => {
  try {
    const { donationId, needId, fulfillmentMode, notes } = req.body;

    if (!donationId || !needId) {
      return res.status(400).json({
        success: false,
        message: 'Both donationId and needId are required to confirm match'
      });
    }

    const result = await matchService.confirmMatch({
      donationId,
      needId,
      userId: req.user._id,
      userRole: req.user.activeRole || req.user.role,
      fulfillmentMode,
      notes
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDonorMatches,
  getReceiverMatches,
  confirmMatch
};
