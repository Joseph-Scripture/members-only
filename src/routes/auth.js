const express = require('express');
const router = express.Router();
const { signup_post } = require('../controllers/authControllers');
const { body } = require('express-validator');

router.post('/signup', 
  [
    body('firstname')
      .trim()
      .notEmpty().withMessage('First name is required')
      .escape(),
    body('lastname')
      .trim()
      .notEmpty().withMessage('Last name is required')
      .escape(),
    body('email')
      .isEmail().withMessage('Must be a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Password must contain at least 1 uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least 1 lowercase letter')
      .matches(/\W/).withMessage('Password must contain at least 1 special character')
  ],
  signup_post
);

module.exports = router;
