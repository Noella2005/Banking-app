const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['transfer', 'deposit', 'withdrawal', 'loan'], required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    fromAccount: { type: String },
    toAccount: { type: String },
    status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);