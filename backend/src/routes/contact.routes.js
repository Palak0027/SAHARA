const express = require('express');
const router = express.Router();
const {
  submitContactMessage,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage
} = require('../controllers/contact.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/role.middleware');

// Public route: submit contact form
router.post('/', submitContactMessage);

// Protected routes: Admin only
router.get('/', protect, authorize('admin'), getContactMessages);
router.patch('/:id', protect, authorize('admin'), updateContactStatus);
router.delete('/:id', protect, authorize('admin'), deleteContactMessage);

module.exports = router;
