// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
    getUserDashboard,
    getUserProfile,
    updateUserProfile
} = require('../controllers/userController');

// Apply the 'protect' middleware to all routes in this file.
// This ensures a user must be logged in to access them.
router.use(protect);

// Define the route for the dashboard data
router.get('/dashboard', getUserDashboard);

// Define the route for the profile/settings page data
router.get('/profile', getUserProfile);

// Define the route for updating profile information with input validation
router.put(
    '/profile',
    [
        // Input validation rules
        body('name', 'Name cannot be empty').optional().trim().notEmpty(),
        body('email', 'Please provide a valid email').optional().isEmail().normalizeEmail(),
        body('password', 'Password must be at least 6 characters long').optional().isLength({ min: 6 }),
    ],
    updateUserProfile
);

module.exports = router;