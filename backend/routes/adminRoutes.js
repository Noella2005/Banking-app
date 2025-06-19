const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, manager } = require('../middleware/authMiddleware');
const {
    getAllUsers,
    approveUser,
    freezeAccount,
    getPendingLoans,
    processLoanRequest,
    auditTransactions
} = require('../controllers/adminController');

// Apply manager-level security to all routes in this file
router.use(protect, manager);

// --- User Management Routes ---
router.get('/users', getAllUsers);
router.put('/users/:id/approve', approveUser);
router.put('/users/:id/freeze', freezeAccount);

// --- Loan Management Routes ---
router.get('/loans/pending', getPendingLoans);
router.put(
    '/loans/:id/action',
    [ body('action').isIn(['approve', 'deny']).withMessage('Action must be "approve" or "deny".') ],
    processLoanRequest
);

// --- Transaction Auditing Route ---
router.get('/transactions', auditTransactions);

module.exports = router;