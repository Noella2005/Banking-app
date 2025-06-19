const express = require('express');
const router = express.Router();
const { transferFunds, getTransactionHistory } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/transfer', protect, transferFunds);
router.get('/history', protect, getTransactionHistory);

module.exports = router;