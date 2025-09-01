import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HabitMilestones.css';

const HabitMilestones = ({ habitId, habitName }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `/api/habits/${habitId}/stats`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStats(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load milestone data');
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (habitId) {
            fetchStats();
        }
    }, [habitId]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return <div className="milestones-loading">Loading milestones...</div>;
    }

    if (error) {
        return <div className="milestones-error">{error}</div>;
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="habit-milestones">
            <div className="milestones-header">
                <h3>{habitName} - Progress & Milestones</h3>
            </div>

            <div className="stats-overview">
                <div className="stat-card">
                    <div className="stat-number">{stats.currentStreak}</div>
                    <div className="stat-label">Current Streak</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.totalCompletions}</div>
                    <div className="stat-label">Total Completions</div>
                </div>
                <div className="stat-card">
                    <div className="stat-number">{stats.achievements.length}</div>
                    <div className="stat-label">Milestones Achieved</div>
                </div>
            </div>

            {stats.nextMilestone && (
                <div className="next-milestone">
                    <h4>Next Milestone</h4>
                    <div className="milestone-progress">
                        <div className="milestone-info">
                            <span className="milestone-icon">{stats.nextMilestone.icon}</span>
                            <div className="milestone-details">
                                <div className="milestone-name">{stats.nextMilestone.name}</div>
                                <div className="milestone-description">{stats.nextMilestone.description}</div>
                                <div className="milestone-reward">+{stats.nextMilestone.xp} XP</div>
                            </div>
                        </div>
                        <div className="progress-info">
                            <div className="days-remaining">
                                {stats.nextMilestone.daysRemaining} days to go!
                            </div>
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill"
                                    style={{ 
                                        width: `${(stats.currentStreak / stats.nextMilestone.days) * 100}%` 
                                    }}
                                ></div>
                            </div>
                            <div className="progress-text">
                                {stats.currentStreak} / {stats.nextMilestone.days} days
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {stats.achievements.length > 0 && (
                <div className="achieved-milestones">
                    <h4>Achieved Milestones</h4>
                    <div className="milestones-grid">
                        {stats.achievements.map((achievement) => (
                            <div key={achievement.id} className="milestone-card achieved">
                                <div className="milestone-icon-large">{achievement.icon}</div>
                                <div className="milestone-content">
                                    <div className="milestone-name">{achievement.name}</div>
                                    <div className="milestone-description">{achievement.description}</div>
                                    <div className="milestone-meta">
                                        <span className="milestone-xp">+{achievement.xp_reward} XP</span>
                                        <span className="milestone-date">
                                            Achieved {formatDate(achievement.unlocked_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {stats.achievements.length === 0 && (
                <div className="no-milestones">
                    <p>No milestones achieved yet. Keep building your streak!</p>
                    <p>Complete your habit for consecutive days to unlock achievements.</p>
                </div>
            )}
        </div>
    );
};

export default HabitMilestones;