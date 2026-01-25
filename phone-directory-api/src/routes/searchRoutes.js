const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const { authenticateUser } = require("../middleware/authMiddleware");

// All search routes require authentication
router.get("/", authenticateUser, searchController.search);
router.get("/detail/:id", authenticateUser, searchController.getDetail);

module.exports = router;
