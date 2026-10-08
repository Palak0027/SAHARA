const express = require('express');
const router = express.Router();
const {
  createNeed,
  getMyNeeds,
  getReceiverDashboard,
  getAllNeeds,
  getNeedById,
  updateNeed,
  deleteNeed
} = require('../controllers/need.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Public feed of community resource needs (open to donors and volunteers)
router.get('/', getAllNeeds);

// Receiver private routes
router.post('/', protect, authorize('receiver', 'admin'), createNeed);
router.get('/my', protect, authorize('receiver', 'admin'), getMyNeeds);
router.get('/dashboard', protect, authorize('receiver', 'admin'), getReceiverDashboard);

// Need details & modification routes
router.get('/:id', getNeedById);
router.patch('/:id', protect, updateNeed);
router.delete('/:id', protect, deleteNeed);

module.exports = router;
