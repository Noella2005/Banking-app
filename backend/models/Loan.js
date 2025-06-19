const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LoanSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Loan', LoanSchema);