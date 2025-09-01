import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationSettings.css';

const NotificationSettings = () => {
    const [preferences, setPreferences] = useState({
        browser_notifications: true,
        email_notifications: false,
        reminder_time: '09:00',
        timezone: 'UTC',
        daily_reminder: true,
        milestone_notifications: true
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchPreferences();
        // Detect user's timezone
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setPreferences(prev => ({ ...prev, timezone: userTimezone }));
    }, []);

    const fetchPreferences = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/notifications/preferences', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                const prefs = response.data.data;
                setPreferences({
                    ...prefs,
                    reminder_time: prefs.reminder_time.slice(0, 5) // Convert HH:MM:SS to HH:MM
                });
            }
        } catch (error) {
            console.error('Error fetching preferences:', error);
        } finally {
            setLoading(false);
        }
    };

    const savePreferences = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put('/api/notifications/preferences', 
                {
                    ...preferences,
                    reminder_time: preferences.reminder_time + ':00' // Convert HH:MM to HH:MM:SS
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                setMessage('Preferences saved successfully!');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            console.error('Error saving preferences:', error);
            setMessage('Error saving preferences');
            setTimeout(() => setMessage(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setMessage('Browser notifications enabled!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                setPreferences(prev => ({ ...prev, browser_notifications: false }));
                setMessage('Browser notifications denied');
                setTimeout(() => setMessage(''), 3000);
            }
        }
    };

    const testNotification = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/notifications/test', 
                { 
                    type: 'browser',
                    message: 'This is a test notification!' 
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Habit Tracker', {
                    body: 'This is a test notification!',
                    icon: '/favicon.ico'
                });
            }
            
            setMessage('Test notification sent!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error('Error sending test notification:', error);
        }
    };

    const handleInputChange = (field, value) => {
        setPreferences(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return <div className="notification-loading">Loading preferences...</div>;
    }

    return (
        <div className="notification-settings">
            <h2>Notification Settings</h2>
            
            {message && (
                <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                </div>
            )}

            <div className="settings-section">
                <h3>Notification Types</h3>
                
                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={preferences.browser_notifications}
                            onChange={(e) => {
                                handleInputChange('browser_notifications', e.target.checked);
                                if (e.target.checked) {
                                    requestNotificationPermission();
                                }
                            }}
                        />
                        <span className="checkmark"></span>
                        Browser Notifications
                    </label>
                    <p className="setting-description">
                        Get notifications directly in your browser
                    </p>
                </div>

                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={preferences.email_notifications}
                            onChange={(e) => handleInputChange('email_notifications', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Email Notifications
                    </label>
                    <p className="setting-description">
                        Receive reminders via email
                    </p>
                </div>
            </div>

            <div className="settings-section">
                <h3>Reminder Settings</h3>
                
                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={preferences.daily_reminder}
                            onChange={(e) => handleInputChange('daily_reminder', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Daily Habit Reminders
                    </label>
                    <p className="setting-description">
                        Get reminded to complete your daily habits
                    </p>
                </div>

                <div className="setting-item">
                    <label className="setting-label">
                        <input
                            type="checkbox"
                            checked={preferences.milestone_notifications}
                            onChange={(e) => handleInputChange('milestone_notifications', e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Milestone Notifications
                    </label>
                    <p className="setting-description">
                        Get notified when you reach new milestones
                    </p>
                </div>

                <div className="setting-item">
                    <label className="time-label">
                        Reminder Time:
                        <input
                            type="time"
                            value={preferences.reminder_time}
                            onChange={(e) => handleInputChange('reminder_time', e.target.value)}
                            className="time-input"
                        />
                    </label>
                </div>

                <div className="setting-item">
                    <label className="timezone-label">
                        Timezone:
                        <select
                            value={preferences.timezone}
                            onChange={(e) => handleInputChange('timezone', e.target.value)}
                            className="timezone-select"
                        >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="Europe/London">London</option>
                            <option value="Europe/Paris">Paris</option>
                            <option value="Asia/Tokyo">Tokyo</option>
                            <option value="Asia/Shanghai">Shanghai</option>
                        </select>
                    </label>
                </div>
            </div>

            <div className="settings-actions">
                <button 
                    onClick={savePreferences}
                    disabled={saving}
                    className="save-button"
                >
                    {saving ? 'Saving...' : 'Save Preferences'}
                </button>
                
                <button 
                    onClick={testNotification}
                    className="test-button"
                >
                    Test Notification
                </button>
            </div>
        </div>
    );
};

export default NotificationSettings;