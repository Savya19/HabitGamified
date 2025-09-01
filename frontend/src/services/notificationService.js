class NotificationService {
    constructor() {
        this.permission = 'default';
        this.init();
    }

    async init() {
        if ('Notification' in window) {
            this.permission = Notification.permission;
        }
    }

    async requestPermission() {
        if ('Notification' in window) {
            this.permission = await Notification.requestPermission();
            return this.permission === 'granted';
        }
        return false;
    }

    showNotification(title, options = {}) {
        if (this.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                ...options
            });

            // Auto close after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);

            return notification;
        }
        return null;
    }

    showHabitReminder(habitName) {
        return this.showNotification('Habit Reminder', {
            body: `Don't forget to complete: ${habitName}`,
            tag: 'habit-reminder',
            requireInteraction: true
        });
    }

    showMilestoneAchieved(milestoneName, emoji) {
        return this.showNotification('Milestone Achieved! 🎉', {
            body: `Congratulations! You've reached: ${emoji} ${milestoneName}`,
            tag: 'milestone-achieved',
            requireInteraction: true
        });
    }

    showDailyReminder() {
        return this.showNotification('Daily Habit Check', {
            body: 'Time to check in on your habits for today!',
            tag: 'daily-reminder'
        });
    }

    showStreakMilestone(days) {
        return this.showNotification('Streak Milestone! 🔥', {
            body: `Amazing! You've maintained your streak for ${days} days!`,
            tag: 'streak-milestone'
        });
    }

    // Schedule daily reminders using service worker (if available)
    async scheduleDailyReminder(time) {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            try {
                const registration = await navigator.serviceWorker.ready;
                
                // Calculate milliseconds until next reminder time
                const now = new Date();
                const [hours, minutes] = time.split(':');
                const reminderTime = new Date();
                reminderTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                
                // If time has passed today, schedule for tomorrow
                if (reminderTime <= now) {
                    reminderTime.setDate(reminderTime.getDate() + 1);
                }
                
                const delay = reminderTime.getTime() - now.getTime();
                
                // Use setTimeout for next reminder (limited to ~24 hours)
                setTimeout(() => {
                    this.showDailyReminder();
                    // Reschedule for next day
                    this.scheduleDailyReminder(time);
                }, Math.min(delay, 24 * 60 * 60 * 1000));
                
            } catch (error) {
                console.error('Error scheduling reminder:', error);
            }
        }
    }

    // Check if notifications are supported
    isSupported() {
        return 'Notification' in window;
    }

    // Get current permission status
    getPermission() {
        return this.permission;
    }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;