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
      message: 'Validation failed',
      errors: errorMap
    });
  }
  next();
};

/**
 * Validation rules for user registration
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
    .isIn(['donor', 'receiver'])
    .withMessage("Intent must be either 'donor' or 'receiver'"),

  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required in location'),

  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Address is required in location'),

  // Conditional: if intent is receiver and receiverType is organization, require organization.orgName
  body('organization.orgName')
    .if(body('receiverType').equals('organization'))
    .trim()
    .notEmpty()
    .withMessage('Organization Name is required for organization receiver'),

  validate
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

  validate
];

module.exports = {
  validateRegister,
  validateLogin
};
