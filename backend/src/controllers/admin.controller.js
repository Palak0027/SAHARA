const adminService = require('../services/admin.service');

/**
 * @desc    Get complete administrative dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    return res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all users with filters and pagination
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const result = await adminService.getAllUsers(req.query);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Toggle user active/blocked status
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private (Admin)
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    const user = await adminService.toggleUserStatus(req.user._id, req.params.id, isActive);
    return res.status(200).json({
      success: true,
      message: `User successfully ${isActive ? 'activated' : 'blocked'}`,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user roles
 * @route   PATCH /api/admin/users/:id/role
 * @access  Private (Admin)
 */
const updateUserRole = async (req, res, next) => {
  try {
    const user = await adminService.updateUserRole(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get full user details
 * @route   GET /api/admin/users/:id
 * @access  Private (Admin)
 */
const getUserDetails = async (req, res, next) => {
  try {
    const data = await adminService.getUserDetails(req.params.id);
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get pending NGO & organization verifications
 * @route   GET /api/admin/verifications
 * @access  Private (Admin)
 */
const getVerifications = async (req, res, next) => {
  try {
    const result = await adminService.getPendingVerifications(req.query);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve or reject organization verification
 * @route   PATCH /api/admin/verifications/:id
 * @access  Private (Admin)
 */
const updateVerification = async (req, res, next) => {
  try {
    const updated = await adminService.updateVerification(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: `Organization verification marked as ${req.body.status}`,
      organization: updated
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all donations for moderation
 * @route   GET /api/admin/donations
 * @access  Private (Admin)
 */
const getAllDonations = async (req, res, next) => {
  try {
    const result = await adminService.getAllDonations(req.query);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update donation status
 * @route   PATCH /api/admin/donations/:id/status
 * @access  Private (Admin)
 */
const updateDonationStatus = async (req, res, next) => {
  try {
    const donation = await adminService.updateDonationStatus(req.params.id, req.body.status);
    return res.status(200).json({
      success: true,
      message: 'Donation status updated successfully',
      donation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all community needs
 * @route   GET /api/admin/needs
 * @access  Private (Admin)
 */
const getAllNeeds = async (req, res, next) => {
  try {
    const result = await adminService.getAllNeeds(req.query);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update need status
 * @route   PATCH /api/admin/needs/:id/status
 * @access  Private (Admin)
 */
const updateNeedStatus = async (req, res, next) => {
  try {
    const need = await adminService.updateNeedStatus(req.params.id, req.body.status);
    return res.status(200).json({
      success: true,
      message: 'Need request status updated successfully',
      need
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get active volunteers with availability and current load
 * @route   GET /api/admin/volunteers
 * @access  Private (Admin)
 */
const getVolunteers = async (req, res, next) => {
  try {
    const volunteers = await adminService.getVolunteers();
    return res.status(200).json({
      success: true,
      count: volunteers.length,
      volunteers
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Dispatch a task and match donation/need to volunteer
 * @route   POST /api/admin/dispatch
 * @access  Private (Admin)
 */
const dispatchTask = async (req, res, next) => {
  try {
    const task = await adminService.dispatchTask(req.user._id, req.body);
    return res.status(201).json({
      success: true,
      message: 'Task successfully created and dispatched',
      task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks
 * @route   GET /api/admin/tasks
 * @access  Private (Admin)
 */
const getAllTasks = async (req, res, next) => {
  try {
    const result = await adminService.getAllTasks(req.query);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create/Onboard a new volunteer
 * @route   POST /api/admin/volunteers
 * @access  Private (Admin)
 */
const createVolunteer = async (req, res, next) => {
  try {
    const volunteer = await adminService.createVolunteer(req.body);
    return res.status(201).json({
      success: true,
      message: 'Volunteer successfully created and onboarded',
      volunteer
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  updateUserRole,
  getUserDetails,
  getVerifications,
  updateVerification,
  getAllDonations,
  updateDonationStatus,
  getAllNeeds,
  updateNeedStatus,
  getVolunteers,
  createVolunteer,
  dispatchTask,
  getAllTasks
};
