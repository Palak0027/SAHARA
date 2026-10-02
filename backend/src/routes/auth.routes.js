const express = require('express');
const router = express.Router();
const { register, login, switchRole, getProfile } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const {
  validateRegister,
  validateLogin
} = require('../middlewares/validators/auth.validator');

// Public Auth Routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Protected Auth Routes (Requires Bearer Token)
router.get('/profile', protect, getProfile);
router.get('/current-user', protect, getProfile); // alias
router.put('/switch-role', protect, switchRole);

module.exports = router;
