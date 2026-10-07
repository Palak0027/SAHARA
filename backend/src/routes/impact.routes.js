const express = require('express');
const router = express.Router();
const { getMyImpact, getGlobalImpact } = require('../controllers/impact.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public overall platform impact metrics
router.get('/', getGlobalImpact);

// Private personal donor impact metrics (matches /api/donations/my pattern)
router.get('/my', protect, getMyImpact);
router.get('/donor', protect, getMyImpact); // alias if needed

module.exports = router;
