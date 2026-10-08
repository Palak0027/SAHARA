const donationService = require('../services/donation.service');

/**
 * @desc    Create a new donation
 * @route   POST /api/donations
 * @access  Private (Donor / Admin)
 */
const createDonation = async (req, res, next) => {
  try {
    const donation = await donationService.createDonation(req.user._id, req.body);
    return res.status(201).json({
      success: true,
      message: 'Donation created successfully',
      donation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all donations created by the logged-in donor
 * @route   GET /api/donations/my
 * @access  Private (Donor / Admin)
 */
const getMyDonations = async (req, res, next) => {
  try {
    const donations = await donationService.getMyDonations(req.user._id, req.query);
    return res.status(200).json({
      success: true,
      count: donations.length,
      donations
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public/available donations with filters & pagination
 * @route   GET /api/donations
 * @access  Public / Authenticated
 */
const getAllDonations = async (req, res, next) => {
  try {
    const result = await donationService.getAllDonations(req.query);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get donation details by ID
 * @route   GET /api/donations/:id
 * @access  Public / Authenticated
 */
const getDonationById = async (req, res, next) => {
  try {
    const donation = await donationService.getDonationById(req.params.id);
    return res.status(200).json({
      success: true,
      donation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update donation details or status
 * @route   PATCH /api/donations/:id
 * @access  Private (Donor Owner / Admin)
 */
const updateDonation = async (req, res, next) => {
  try {
    const updatedDonation = await donationService.updateDonation(
      req.params.id,
      req.user._id,
      req.user.activeRole || req.user.role,
      req.body
    );
    return res.status(200).json({
      success: true,
      message: 'Donation updated successfully',
      donation: updatedDonation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete or cancel a donation
 * @route   DELETE /api/donations/:id
 * @access  Private (Donor Owner / Admin)
 */
const deleteDonation = async (req, res, next) => {
  try {
    await donationService.deleteDonation(
      req.params.id,
      req.user._id,
      req.user.activeRole || req.user.role
    );
    return res.status(200).json({
      success: true,
      message: 'Donation deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get donor dashboard metrics & recent donations
 * @route   GET /api/donations/dashboard
 * @access  Private (Donor / Admin)
 */
const getDonorDashboard = async (req, res, next) => {
  try {
    const dashboardData = await donationService.getDonorDashboard(req.user._id);
    return res.status(200).json({
      success: true,
      ...dashboardData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDonation,
  getMyDonations,
  getDonorDashboard,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation
};
