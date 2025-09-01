const { NotificationPreference, User } = require('../models');

const notificationController = {
    // Get user's notification preferences
    async getPreferences(req, res) {
        try {
            const userId = req.user.id;
            
            let preferences = await NotificationPreference.findOne({
                where: { user_id: userId }
            });

            // Create default preferences if they don't exist
            if (!preferences) {
                preferences = await NotificationPreference.create({
                    user_id: userId,
                    browser_notifications: true,
                    email_notifications: false,
                    reminder_time: '09:00:00',
                    timezone: 'UTC',
                    daily_reminder: true,
                    milestone_notifications: true
                });
            }

            res.json({
                success: true,
                data: preferences
            });
        } catch (error) {
            console.error('Error fetching notification preferences:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch notification preferences'
            });
        }
    },

    // Update notification preferences
    async updatePreferences(req, res) {
        try {
            const userId = req.user.id;
            const {
                browser_notifications,
                email_notifications,
                reminder_time,
                timezone,
                daily_reminder,
                milestone_notifications
            } = req.body;

            let preferences = await NotificationPreference.findOne({
                where: { user_id: userId }
            });

            if (!preferences) {
                preferences = await NotificationPreference.create({
                    user_id: userId,
                    browser_notifications: browser_notifications ?? true,
                    email_notifications: email_notifications ?? false,
                    reminder_time: reminder_time ?? '09:00:00',
                    timezone: timezone ?? 'UTC',
                    daily_reminder: daily_reminder ?? true,
                    milestone_notifications: milestone_notifications ?? true
                });
            } else {
                await preferences.update({
                    browser_notifications: browser_notifications ?? preferences.browser_notifications,
                    email_notifications: email_notifications ?? preferences.email_notifications,
                    reminder_time: reminder_time ?? preferences.reminder_time,
                    timezone: timezone ?? preferences.timezone,
                    daily_reminder: daily_reminder ?? preferences.daily_reminder,
                    milestone_notifications: milestone_notifications ?? preferences.milestone_notifications,
                    updated_at: new Date()
                });
            }

            res.json({
                success: true,
                data: preferences
            });
        } catch (error) {
            console.error('Error updating notification preferences:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update notification preferences'
            });
        }
    },

    // Get users who need daily reminders (for background service)
    async getUsersForReminders(req, res) {
        try {
            const now = new Date();
            const currentTime = now.toTimeString().slice(0, 8); // HH:MM:SS format
            
            const users = await User.findAll({
                include: [{
                    model: NotificationPreference,
                    where: {
                        daily_reminder: true,
                        browser_notifications: true,
                        reminder_time: currentTime
                    }
                }],
                attributes: ['id', 'username', 'email']
            });

            res.json({
                success: true,
                data: users
            });
        } catch (error) {
            console.error('Error fetching users for reminders:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch users for reminders'
            });
        }
    },

    // Test notification endpoint
    async testNotification(req, res) {
        try {
            const userId = req.user.id;
            const { type, message } = req.body;

            // In a real implementation, you would send the notification here
            // For now, we'll just return success
            res.json({
                success: true,
                message: `Test ${type} notification sent: ${message}`
            });
        } catch (error) {
            console.error('Error sending test notification:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send test notification'
            });
        }
    }
};

module.exports = notificationController;