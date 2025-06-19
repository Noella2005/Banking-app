// backend/server.js - FINAL CORRECTED VERSION

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
    message: { message: 'Too many authentication attempts from this IP, please try again after 15 minutes' },
});

// --- THIS IS THE ONLY SECTION THAT HAS CHANGED ---
// Connect to MongoDB without the deprecated options
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.error(err)); // The .catch will now properly log the 'bad auth' error if it persists
// ---------------------------------------------

app.get('/', (req, res) => {
    res.send('MERN Banking API is running...');
});

app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/loans', require('./routes/loanRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));