const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authMiddleware");
const limiter = require("../utils/limiter");

// Public routes
router.post("/signup", limiter, userController.signup);
router.post("/login", limiter, userController.login);

// Protected routes
router.get("/profile", authenticateUser, userController.getProfile);

module.exports = router;
