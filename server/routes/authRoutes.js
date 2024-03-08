const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const limiter = require('../utils/limiter');

// Signup route with rate limiting
router.post('/signup', limiter, authController.postSignup);

// Login route with rate limiting
router.post('/login', limiter, authController.getLogin);

// Verify email route with rate limiting
router.post('/verify-email', limiter, authController.postVerifyEmail);

// Verify OTP route with rate limiting
router.post('/verify-otp', limiter, authController.postVerifyOTP);

// Reset password route with rate limiting
router.post('/reset-password', limiter, authController.postResetPassword);

module.exports = router;
