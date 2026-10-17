const express = require('express');
const router = express.Router();

const {
  register,
  login,
  switchRole,
  getProfile,
  changePassword
} = require('../controllers/auth.controller');
const { forgotPassword, resetPassword } = require('../controllers/passwordReset.controller');
const { validateRegister, validateLogin } = require('../middlewares/validators/auth.validator');
const { protect } = require('../middlewares/auth.middleware');

// Public auth routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected auth routes
router.get('/profile', protect, getProfile);
router.get('/current-user', protect, getProfile);
router.put('/switch-role', protect, switchRole);

module.exports = router;
