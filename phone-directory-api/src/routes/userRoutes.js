const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authMiddleware");
const { authLimiter } = require("../utils/limiter");

// Public routes (with rate limiting)
router.post("/signup", authLimiter, userController.signup);
router.post("/login", authLimiter, userController.login);

// Protected routes
router.get("/profile", authenticateUser, userController.getProfile);

module.exports = router;
