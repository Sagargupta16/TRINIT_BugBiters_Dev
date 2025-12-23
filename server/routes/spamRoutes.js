const express = require("express");
const router = express.Router();
const spamController = require("../controllers/spamController");
const { authenticateUser } = require("../middleware/authMiddleware");

// All spam routes require authentication
router.post("/", authenticateUser, spamController.reportSpam);
router.get("/stats/:phoneNumber", authenticateUser, spamController.getSpamStats);

module.exports = router;
