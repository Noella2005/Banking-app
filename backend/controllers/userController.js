// backend/controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

/**
 * @desc    Get current user's dashboard info
 * @route   GET /api/users/dashboard
 * @access  Private
 */
exports.getUserDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            name: user.name,
            accountNumber: user.accountNumber,
            balance: user.balance,
            profilePicInitial: user.profilePicInitial,
        });
    } catch (error) {
        console.error("Error in getUserDashboard:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get full user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Update user profile (name, email, password)
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateUserProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (name) {
            user.name = name;
            user.profilePicInitial = name.charAt(0).toUpperCase();
        }

        if (email) user.email = email;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                profilePicInitial: updatedUser.profilePicInitial,
            }
        });

    } catch (error) {
        console.error("Error in updateUserProfile:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
};
