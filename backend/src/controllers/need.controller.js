const needService = require('../services/need.service');

/**
 * @desc    Create a new need request
 * @route   POST /api/needs
 * @access  Private (Receiver / Admin)
 */
const createNeed = async (req, res, next) => {
  try {
    const need = await needService.createNeed(req.user._id, req.user, req.body);
    return res.status(201).json({
      success: true,
      message: 'Need request created successfully',
      need
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all needs raised by the logged-in receiver
 * @route   GET /api/needs/my
 * @access  Private (Receiver / Admin)
 */
const getMyNeeds = async (req, res, next) => {
  try {
    const needs = await needService.getMyNeeds(req.user._id, req.query);
    return res.status(200).json({
      success: true,
      count: needs.length,
      needs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get receiver dashboard overview metrics & recent needs
 * @route   GET /api/needs/dashboard
 * @access  Private (Receiver / Admin)
 */
const getReceiverDashboard = async (req, res, next) => {
  try {
    const dashboardData = await needService.getReceiverDashboard(req.user._id);
    return res.status(200).json({
      success: true,
      ...dashboardData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get public/feed needs with filters & pagination
 * @route   GET /api/needs
 * @access  Public / Authenticated
 */
const getAllNeeds = async (req, res, next) => {
  try {
    const result = await needService.getAllNeeds(req.query);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single need request details
 * @route   GET /api/needs/:id
 * @access  Public / Authenticated
 */
const getNeedById = async (req, res, next) => {
  try {
    const need = await needService.getNeedById(req.params.id);
    return res.status(200).json({
      success: true,
      need
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update need request details or status
 * @route   PATCH /api/needs/:id
 * @access  Private (Receiver Owner / Admin)
 */
const updateNeed = async (req, res, next) => {
  try {
    const updatedNeed = await needService.updateNeed(
      req.params.id,
      req.user._id,
      req.user.activeRole || req.user.role,
      req.body
    );
    return res.status(200).json({
      success: true,
      message: 'Need request updated successfully',
      need: updatedNeed
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete / Cancel a need request
 * @route   DELETE /api/needs/:id
 * @access  Private (Receiver Owner / Admin)
 */
const deleteNeed = async (req, res, next) => {
  try {
    await needService.deleteNeed(
      req.params.id,
      req.user._id,
      req.user.activeRole || req.user.role
    );
    return res.status(200).json({
      success: true,
      message: 'Need request deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNeed,
  getMyNeeds,
  getReceiverDashboard,
  getAllNeeds,
  getNeedById,
  updateNeed,
  deleteNeed
};
