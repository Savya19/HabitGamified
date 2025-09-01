import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HabitCalendar.css';

const HabitCalendar = ({ habitId, habitName }) => {
    const [calendarData, setCalendarData] = useState({});
    const [currentDate, setCurrentDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const fetchCalendarData = async (year, month) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `/api/habits/${habitId}/calendar?year=${year}&month=${month}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCalendarData(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load calendar data');
            console.error('Error fetching calendar:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (habitId) {
            fetchCalendarData(currentDate.getFullYear(), currentDate.getMonth() + 1);
        }
    }, [habitId, currentDate]);

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const renderCalendarDays = () => {
        if (!calendarData.totalDaysInMonth) return null;

        const days = [];
        const firstDay = new Date(calendarData.year, calendarData.month - 1, 1).getDay();
        
        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Add days of the month
        for (let day = 1; day <= calendarData.totalDaysInMonth; day++) {
            const isCompleted = calendarData.calendarData[day]?.completed;
            const isToday = new Date().toDateString() === new Date(calendarData.year, calendarData.month - 1, day).toDateString();
            
            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}`}
                    title={isCompleted ? `Completed on ${day}` : `Not completed on ${day}`}
                >
                    <span className="day-number">{day}</span>
                    {isCompleted && <span className="completion-indicator">✓</span>}
                </div>
            );
        }

        return days;
    };

    if (loading) {
        return <div className="calendar-loading">Loading calendar...</div>;
    }

    if (error) {
        return <div className="calendar-error">{error}</div>;
    }

    return (
        <div className="habit-calendar">
            <div className="calendar-header">
                <h3>{habitName} - Calendar</h3>
                <div className="calendar-navigation">
                    <button onClick={() => navigateMonth(-1)} className="nav-button">
                        ←
                    </button>
                    <span className="current-month">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button onClick={() => navigateMonth(1)} className="nav-button">
                        →
                    </button>
                </div>
            </div>
            
            <div className="calendar-stats">
                <span className="stat">
                    Completed: {calendarData.completedDays || 0} days this month
                </span>
            </div>

            <div className="calendar-grid">
                <div className="calendar-weekdays">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="weekday">{day}</div>
                    ))}
                </div>
                <div className="calendar-days">
                    {renderCalendarDays()}
                </div>
            </div>
        </div>
    );
};

export default HabitCalendar;