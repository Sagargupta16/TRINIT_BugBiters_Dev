const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const limiter = require('../utils/limiter');

// View all users without rate limiting
router.get('/view', authenticateUser, userController.viewAllUsers);

// View a single user by ID with rate limiting
router.get('/view/:id', authenticateUser, userController.viewSingleUser);

// Update a User with rate limiting
router.put('/update/:id', authenticateUser, limiter, userController.updateUser);

// Delete a User with rate limiting
router.delete('/delete/:id', authenticateUser, limiter, userController.deleteUser);

module.exports = router;
