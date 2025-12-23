const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { authenticateUser } = require("../middleware/authMiddleware");

// All dashboard routes require authentication
router.get(
  "/interactions/recent",
  authenticateUser,
  dashboardController.getRecentInteractions
);
router.get(
  "/contacts/top",
  authenticateUser,
  dashboardController.getTopContacts
);
router.get(
  "/spam/reports",
  authenticateUser,
  dashboardController.getSpamReports
);
router.get("/statistics", authenticateUser, dashboardController.getStatistics);
router.post("/interaction", authenticateUser, dashboardController.createInteraction);

module.exports = router;
