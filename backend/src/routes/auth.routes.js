const express = require('express');

const router = express.Router();

const {
  register,
  login,
  switchRole,
  getProfile
} = require('../controllers/auth.controller');

const {
  validateRegister,
  validateLogin
} = require('../middlewares/validators/auth.validator');

const {
  protect
} = require('../middlewares/auth.middleware');

// ==========================================
// PUBLIC AUTH ROUTES
// ==========================================

router.post(
  '/register',
  validateRegister,
  register
);

router.post(
  '/login',
  validateLogin,
  login
);

// ==========================================
// PROTECTED AUTH ROUTES
// ==========================================

router.get(
  '/profile',
  protect,
  getProfile
);

router.get(
  '/current-user',
  protect,
  getProfile
);

router.put(
  '/switch-role',
  protect,
  switchRole
);

module.exports = router;