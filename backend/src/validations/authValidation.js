const { body } = require('express-validator');

exports.registerValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 2 })
    .withMessage('Username must be at least 2 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscore and hyphen')
    .toLowerCase(),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

exports.loginValidation = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .toLowerCase(),
  body('password').notEmpty().withMessage('Password is required'),
];
