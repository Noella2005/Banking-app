// backend/controllers/notificationController.js

const Notification = require('../models/Notification'); // This path is correct.

// @desc    Get all notifications for the logged-in user
exports.getNotifications = async (req, res) => {
    try {
        // Find notifications for the current user, sorted by most recent
        const notifications = await Notification.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(15); // Increased limit slightly

        // Also get a count of unread notifications efficiently
        const unreadCount = await Notification.countDocuments({ userId: req.user.id, read: false });

        res.json({
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Mark notifications as read
exports.markAsRead = async (req, res) => {
    try {
        // Mark all of the user's unread notifications as read
        await Notification.updateMany(
            { userId: req.user.id, read: false },
            { $set: { read: true } }
        );
        res.status(200).json({ message: 'Notifications marked as read' });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};