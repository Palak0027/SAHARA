const express = require('express');
const router = express.Router();
const {
  createDonation,
  getMyDonations,
  getDonorDashboard,
  getAllDonations,
  getDonationById,
  updateDonation,
  deleteDonation
} = require('../controllers/donation.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Public / Feed routes
router.get('/', getAllDonations);

// Donor private routes
router.post('/', protect, authorize('donor', 'admin'), createDonation);
router.get('/my', protect, authorize('donor', 'admin'), getMyDonations);
router.get('/dashboard', protect, authorize('donor', 'admin'), getDonorDashboard);

// Donation details & modifications
router.get('/:id', getDonationById);
router.patch('/:id', protect, updateDonation);
router.delete('/:id', protect, deleteDonation);

module.exports = router;
