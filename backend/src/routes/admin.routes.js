const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/admin.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// All admin routes require authentication and admin role
router.use(protect, authorize('admin'));

// Stats & Dashboard
router.get('/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.patch('/users/:id/status', toggleUserStatus);
router.patch('/users/:id/role', updateUserRole);

// Verifications (NGOs & Organizations)
router.get('/verifications', getVerifications);
router.patch('/verifications/:id', updateVerification);

// Donations Moderation
router.get('/donations', getAllDonations);
router.patch('/donations/:id/status', updateDonationStatus);

// Needs Moderation
router.get('/needs', getAllNeeds);
router.patch('/needs/:id/status', updateNeedStatus);

// Volunteers & Dispatching
router.get('/volunteers', getVolunteers);
router.post('/volunteers', createVolunteer);
router.post('/dispatch', dispatchTask);
router.get('/tasks', getAllTasks);

module.exports = router;
