const express = require('express');
const router = express.Router();
const {
  getDonorMatches,
  getReceiverMatches,
  confirmMatch
} = require('../controllers/match.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

router.get('/donor', protect, authorize('donor', 'admin'), getDonorMatches);
router.get('/receiver', protect, authorize('receiver', 'admin'), getReceiverMatches);
router.post('/confirm', protect, confirmMatch);

module.exports = router;
