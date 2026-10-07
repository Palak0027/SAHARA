const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/category.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Public route to populate category dropdown in Donation & Need forms
router.get('/', getCategories);

// Protected route: Authenticated users (donors, receivers, admins) can quick-add a category from dropdown
router.post('/', protect, createCategory);

// Admin-only management routes
router.patch('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

module.exports = router;
