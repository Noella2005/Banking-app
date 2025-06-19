const User = require('../models/User');
const Loan = require('../models/Loan');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

// @desc    Get all users (for management)
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Approve a new user account
// @route   PUT /api/admin/users/:id/approve
exports.approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.status = 'active';
        await user.save();
        res.json({ message: 'User account approved successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// @desc    Freeze or Unfreeze a user account
exports.freezeAccount = async (req, res) => {
    try {
       const user = await User.findById(req.params.id);
       if (!user) {
           return res.status(404).json({ message: 'User not found' });
       }
       // This logic toggles the status between 'frozen' and 'active'
       user.status = user.status === 'frozen' ? 'active' : 'frozen';
       await user.save();
       res.json({ message: `User account has been set to: ${user.status}.` });
   } catch (error) {
       res.status(500).json({ message: 'Server error' });
   }
}

// @desc    Get all pending loan requests, populated with user info
// @route   GET /api/admin/loans/pending
// @access  Private/Manager
exports.getPendingLoans = async (req, res) => {
    try {
        // Populate fetches the referenced user's details
        const loans = await Loan.find({ status: 'pending' }).populate('userId', 'name email accountNumber');
        res.json(loans);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Approve or Deny a loan request
// @route   PUT /api/admin/loans/:id/action
// @access  Private/Manager

exports.processLoanRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { action } = req.body;
    const { id } = req.params;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const loan = await Loan.findById(id).session(session);
        if (!loan || loan.status !== 'pending') {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Loan not found or already processed.' });
        }

        const user = await User.findById(loan.userId).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'User for this loan not found.' });
        }

        if (action === 'approve') {
            loan.status = 'approved';
            
            // 1. Update user's balance
            user.balance += loan.amount;
            await user.save({ session });

            // Create a transaction log for this loan deposit, ensuring loan.amount is passed correctly.
            await Transaction.create([{
                userId: user._id,
                type: 'loan',
                amount: loan.amount, // This ensures the correct loan amount is saved.
                description: `Loan of $${loan.amount.toFixed(2)} approved by management.`,
                status: 'completed'
            }], { session });
            // -------------------------
            
            // Create a notification for the user
            await Notification.create([{
                userId: user._id,
                message: `Your loan request for $${loan.amount.toFixed(2)} has been approved.`,
                link: '/dashboard/history'
            }], { session });

        } else { // Action is 'deny'
            loan.status = 'denied';
            // Create a notification for the user
             await Notification.create([{
                userId: user._id,
                message: `Your loan request for $${loan.amount.toFixed(2)} has been denied.`,
                link: '/dashboard/request-loan'
            }], { session });
        }
        
        await loan.save({ session });
        await session.commitTransaction();

        res.json({ message: `Loan has been successfully ${loan.status}.` });
        
    } catch (error) {
        await session.abortTransaction();
        console.error("Error in processLoanRequest:", error);
        res.status(500).json({ message: 'Server error during loan processing.' });
    } finally {
        session.endSession();
    }
};

// @desc    Audit all transactions in the system
// @route   GET /api/admin/transactions
// @access  Private/Manager
exports.auditTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({})
            .populate('userId', 'name email accountNumber') // Get user details for each transaction
            .sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};