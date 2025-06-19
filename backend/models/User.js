const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'manager'], default: 'user' },
    accountNumber: { type: String, unique: true, sparse: true },
    // --- THIS IS THE FIX ---
    // Ensure every user, upon creation, gets a balance of 0.
    balance: { type: Number, required: true, default: 0 },
    // -------------------------
    status: { type: String, enum: ['pending', 'active', 'frozen'], default: 'pending' },
    profilePicInitial: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);