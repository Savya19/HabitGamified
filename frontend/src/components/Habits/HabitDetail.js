import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HabitCalendar from './HabitCalendar';
import HabitMilestones from './HabitMilestones';
import './HabitDetail.css';

const HabitDetail = () => {
    const { habitId } = useParams();
    const navigate = useNavigate();
    const [habit, setHabit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [completingToday, setCompletingToday] = useState(false);
    const [todayCompleted, setTodayCompleted] = useState(false);

    const fetchHabit = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // Fetch habit details
            const habitsResponse = await axios.get('/api/habits', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const currentHabit = habitsResponse.data.find(h => h.id === parseInt(habitId));
            if (!currentHabit) {
                setError('Habit not found');
                return;
            }
            
            setHabit(currentHabit);
            
            // Check if completed today
            const today = new Date();
            const completionsResponse = await axios.get(`/api/habits/${habitId}/completions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const todayCompletion = completionsResponse.data.completions.find(completion => {
                const completionDate = new Date(completion.date);
                return completionDate.toDateString() === today.toDateString();
            });
            
            setTodayCompleted(!!todayCompletion);
            setError('');
        } catch (err) {
            setError('Failed to load habit details');
            console.error('Error fetching habit:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (habitId) {
            fetchHabit();
        }
    }, [habitId]);

    const handleCompleteToday = async () => {
        if (todayCompleted || completingToday) return;
        
        try {
            setCompletingToday(true);
            const token = localStorage.getItem('token');
            
            await axios.post(`/api/habits/${habitId}/complete`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setTodayCompleted(true);
            
            // Show success message
            alert('Habit completed for today! 🎉');
            
        } catch (err) {
            console.error('Error completing habit:', err);
            alert('Failed to mark habit as completed');
        } finally {
            setCompletingToday(false);
        }
    };

    const getDifficultyColor = (level) => {
        switch (level) {
            case 1: return '#28a745'; // Easy - Green
            case 2: return '#ffc107'; // Medium - Yellow
            case 3: return '#fd7e14'; // Hard - Orange
            case 4: return '#dc3545'; // Very Hard - Red
            default: return '#6c757d'; // Default - Gray
        }
    };

    const getDifficultyText = (level) => {
        switch (level) {
            case 1: return 'Easy';
            case 2: return 'Medium';
            case 3: return 'Hard';
            case 4: return 'Very Hard';
            default: return 'Unknown';
        }
    };

    if (loading) {
        return <div className="habit-detail-loading">Loading habit details...</div>;
    }

    if (error) {
        return (
            <div className="habit-detail-error">
                <p>{error}</p>
                <button onClick={() => navigate('/dashboard')} className="back-button">
                    Back to Dashboard
                </button>
            </div>
        );
    }

    if (!habit) {
        return null;
    }

    return (
        <div className="habit-detail">
            <div className="habit-detail-header">
                <button onClick={() => navigate('/dashboard')} className="back-button">
                    ← Back to Dashboard
                </button>
                
                <div className="habit-info">
                    <h1>{habit.name}</h1>
                    <p className="habit-description">{habit.description}</p>
                    
                    <div className="habit-meta">
                        <span className="habit-category">{habit.category}</span>
                        <span 
                            className="habit-difficulty"
                            style={{ backgroundColor: getDifficultyColor(habit.difficulty_level) }}
                        >
                            {getDifficultyText(habit.difficulty_level)}
                        </span>
                        <span className="habit-frequency">{habit.target_frequency}</span>
                    </div>
                </div>
                
                <div className="habit-actions">
                    <button
                        onClick={handleCompleteToday}
                        disabled={todayCompleted || completingToday}
                        className={`complete-button ${todayCompleted ? 'completed' : ''}`}
                    >
                        {completingToday ? 'Completing...' : 
                         todayCompleted ? '✓ Completed Today' : 'Complete Today'}
                    </button>
                </div>
            </div>

            <div className="habit-detail-content">
                <HabitMilestones habitId={habitId} habitName={habit.name} />
                <HabitCalendar habitId={habitId} habitName={habit.name} />
            </div>
        </div>
    );
};

export default HabitDetail;