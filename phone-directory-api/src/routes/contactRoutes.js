const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { authenticateUser } = require("../middleware/authMiddleware");

// All contact routes require authentication
router.post("/", authenticateUser, contactController.createContact);
router.get("/", authenticateUser, contactController.getContacts);
router.delete("/:id", authenticateUser, contactController.deleteContact);

module.exports = router;
