const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: { type: String } // Optional: A link to navigate to on click
}, { timestamps: true });

// Add an index on userId and read status for fast queries
NotificationSchema.index({ userId: 1, read: 1 });

module.exports = mongoose.model('Notification', NotificationSchema);