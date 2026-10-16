const authService = require('../services/auth.service');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 *
 * Public registration is allowed for:
 * Donor, Receiver, Volunteer
 *
 * Admin registration is NOT allowed.
 */
const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    return res.status(201).json({
      success: true,

      message: 'Registration successful',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login existing user with email or phone + password
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;
    const result = await authService.login(identifier, password);
    return res.status(200).json({
      success: true,

      message: 'Login successful',
      token: result.token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Switch active mode
 * @route   PUT /api/auth/switch-role
 * @access  Private
 *
 * Only Donor <-> Receiver switching is allowed.
 * Volunteer/Admin cannot be unlocked through this endpoint.
 */
const switchRole = async (
  req,
  res,
  next
) => {
  try {
    const result = await authService.switchRole(req.user._id, req.body);
    return res.status(200).json({
      success: true,
      message: `Switched to ${result.targetRole} mode successfully`,
      token: result.token,
      user: result.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get profile of logged-in user
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password for authenticated user
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = async (req, res, next) => {
  try {
    const result = await authService.changePassword(req.user._id, req.body);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  switchRole,
  getProfile,
  getMe: getProfile,
  changePassword,
};