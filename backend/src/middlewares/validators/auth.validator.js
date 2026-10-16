const { body, validationResult } = require('express-validator');

/**
 * Middleware to check validation results and return formatted response
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMap = {};

    errors.array().forEach((err) => {
      if (!errorMap[err.path]) {
        errorMap[err.path] = err.msg;
      }
    });

    return res.status(400).json({
      success: false,
      message: 'Please fill in all required fields with valid information.',
      errors: errorMap,
    });
  }

  next();
};

/**
 * Validation rules for user registration
 *
 * Public registration is allowed for:
 * - donor
 * - receiver
 * - volunteer
 *
 * Admin is intentionally NOT allowed here.
 */
const validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),

  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/)
    .withMessage('Phone number must be a valid 10-digit number'),

  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('intent')
    .notEmpty()
    .withMessage('Intent is required')
    .isIn(['donor', 'receiver', 'volunteer'])
    .withMessage(
      "Intent must be either 'donor', 'receiver', or 'volunteer'"
    ),

  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required in location'),

  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required in location'),

  // Receiver-specific validation
  body('organization.orgName')
    .if(body('receiverType').equals('organization'))
    .trim()
    .notEmpty()
    .withMessage('Organization Name is required for organization receiver'),

  validate,
];

/**
 * Validation rules for user login
 */
const validateLogin = [
  body('identifier')
    .trim()
    .notEmpty()
    .withMessage('Phone number or email is required'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  validate,
];

/**
 * Validation rules for changing password
 */
const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),

  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('New password and confirm password do not match');
      }
      return true;
    }),

  validate,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateChangePassword,
};