// backend/controllers/transactionController.js
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Transfer funds
// @route   POST /api/transactions/transfer
exports.transferFunds = async (req, res) => {
    const { toAccountNumber, amount, description } = req.body;
    const session = await mongoose.startSession(); // For atomic transactions
    session.startTransaction();

    try {
        const fromUser = await User.findById(req.user.id).session(session);
        if (fromUser.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        const toUser = await User.findOne({ accountNumber: toAccountNumber }).session(session);
        if (!toUser) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Recipient account not found' });
        }

        // Perform the transfer
        fromUser.balance -= amount;
        toUser.balance += amount;

        await fromUser.save({ session });
        await toUser.save({ session });

        // Log the transaction for both users
        await Transaction.create([{
            userId: fromUser._id,
            type: 'transfer',
            amount: -amount,
            description,
            fromAccount: fromUser.accountNumber,
            toAccount: toUser.accountNumber,
        }, {
            userId: toUser._id,
            type: 'transfer',
            amount: amount,
            description,
            fromAccount: fromUser.accountNumber,
            toAccount: toUser.accountNumber,
        }], { session });

        await Notification.create({
            userId: toUser._id,
            message: `${fromUser.name} sent you $${amount.toFixed(2)}.`,
            link: '/dashboard/history'
        });

        await session.commitTransaction();
        res.status(200).json({ message: 'Transfer successful' });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: 'Server error during transaction' });
    } finally {
        session.endSession();
    }
};

// @desc    Get transaction history
// @route   GET /api/transactions/history
exports.getTransactionHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};