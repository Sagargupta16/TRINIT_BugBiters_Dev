/**
 * Rate Limiting Utility
 * Prevents brute force attacks
 */

const rateLimit = require("express-rate-limit");

// Rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    status: false,
    errors: ["Too many requests, please try again later"],
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for general API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    status: false,
    errors: ["Too many requests, please try again later"],
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };
