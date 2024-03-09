const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');
const limiter = require('../utils/limiter');

// View all Students without rate limiting
router.get('/view', authenticateUser, studentController.viewAllStudents);

// View a single Student by ID with rate limiting
router.get('/view/:id', authenticateUser, studentController.viewSingleStudent);

// Update a Student with rate limiting
router.put('/update/:id', authenticateUser, limiter, studentController.updateStudent);

// Delete a Student with rate limiting
router.delete('/delete/:id', authenticateUser, limiter, studentController.deleteStudent);

router.post('/create-checkout-session', authenticateUser, studentController.createCheckoutSession);

module.exports = router;
