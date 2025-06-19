const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { requestLoan, getLoanHistory } = require('../controllers/loanController');

router.use(protect);

router.post(
    '/request',
    [
        body('amount', 'Amount is required and must be a positive number').isFloat({ gt: 0 }),
        body('reason', 'A reason for the loan is required').not().isEmpty().trim().escape(), // .escape() prevents XSS
    ],
    requestLoan
);

router.get('/history', getLoanHistory);

module.exports = router;