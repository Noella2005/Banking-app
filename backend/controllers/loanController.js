const User = require('../models/User');
const Notification = require('../models/Notification');

const Loan = require('../models/Loan');
const { validationResult } = require('express-validator');

// @desc    Request a new loan
// @route   POST /api/loans/request
// @access  Private
exports.requestLoan = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { amount, reason } = req.body;

    try {
        const newLoan = new Loan({
            userId: req.user.id,
            amount: parseFloat(amount),
            reason,
        });

        const loan = await newLoan.save();
        const managers = await User.find({ role: 'manager' });
        for (const manager of managers) {
            await Notification.create({
                userId: manager._id,
                message: `A new loan request for $${amount.toFixed(2)} was submitted.`,
                link: '/admin/loans'
            });
        }       
        res.status(201).json({ message: 'Loan request submitted successfully. It is now pending approval.', loan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's loan history
// @route   GET /api/loans/history
// @access  Private
exports.getLoanHistory = async (req, res) => {
    try {
        const loans = await Loan.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(loans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};