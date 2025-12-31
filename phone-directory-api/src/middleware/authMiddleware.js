/**
 * Authentication Middleware
 * Handles JWT token validation and user authentication
 */

const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");
const User = require("../models/User");

/**
 * Middleware to authenticate user using JWT token
 */
const authenticateUser = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers["authorization"];
    
    if (!authHeader) {
      return res.status(401).json({
        status: false,
        errors: ["Authorization header missing"],
      });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        status: false,
        errors: ["Token missing from Authorization header"],
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check token expiry
    if (decoded.exp * 1000 < Date.now()) {
      return res.status(401).json({
        status: false,
        errors: ["Token has expired"],
      });
    }

    // Find user
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        status: false,
        errors: ["User not found"],
      });
    }

    // Attach user and token to request
    req.user = user;
    req.token = token;
    
    logger.info(`User authenticated: ${user.phoneNumber}`);
    
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: false,
        errors: ["Token has expired"],
      });
    }
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: false,
        errors: ["Invalid token"],
      });
    }
    
    res.status(401).json({
      status: false,
      errors: ["Unauthorized"],
    });
  }
};

module.exports = { authenticateUser };
