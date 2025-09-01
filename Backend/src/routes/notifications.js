const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get notification preferences
router.get('/preferences', notificationController.getPreferences);

// Update notification preferences
router.put('/preferences', notificationController.updatePreferences);

// Test notification
router.post('/test', notificationController.testNotification);

// Get users for reminders (internal use)
router.get('/users-for-reminders', notificationController.getUsersForReminders);

module.exports = router;