import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Award,
  Plus,
  CheckCircle,
  Clock
} from 'lucide-react';
import axios from 'axios';
import ProgressWidget from './ProgressWidget';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    streak: 0,
    totalXP: 0
  });
  const [loading, setLoading] = useState(true);
  const [habitCompletions, setHabitCompletions] = useState({}); // { habitId: [dates] }
  const [habitStats, setHabitStats] = useState({}); // { habitId: { streak, total } }
  const [completedToday, setCompletedToday] = useState(new Set());
  const [completingHabits, setCompletingHabits] = useState(new Set());

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [habitsResponse] = await Promise.all([
        axios.get('/api/habits', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      const userHabits = habitsResponse.data;
      setHabits(userHabits);
      
      // Check which habits are completed today
      const today = new Date();
      const completedSet = new Set();
      let todayCompletionCount = 0;
      
      for (const habit of userHabits) {
        try {
          const completionsResponse = await axios.get(`/api/habits/${habit.id}/completions`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const todayCompletion = completionsResponse.data.completions.find(completion => {
            const completionDate = new Date(completion.date);
            return completionDate.toDateString() === today.toDateString();
          });
          
          if (todayCompletion) {
            completedSet.add(habit.id);
            todayCompletionCount++;
          }
        } catch (err) {
          console.error(`Failed to fetch completions for habit ${habit.id}:`, err);
        }
      }
      
      setCompletedToday(completedSet);
      
      // Calculate stats
      const activeHabits = userHabits.filter(habit => habit.is_active);
      
      setStats({
        totalHabits: activeHabits.length,
        completedToday: todayCompletionCount,
        streak: 0, // This would need streak calculation
        totalXP: user?.total_xp || 0
      });
      
      await fetchAllHabitCompletions(userHabits);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const markHabitComplete = async (habitId) => {
    if (completedToday.has(habitId) || completingHabits.has(habitId)) return;
    
    try {
      setCompletingHabits(prev => new Set([...prev, habitId]));
      const token = localStorage.getItem('token');
      
      await axios.post(`/api/habits/${habitId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      setCompletedToday(prev => new Set([...prev, habitId]));
      setStats(prev => ({
        ...prev,
        completedToday: prev.completedToday + 1
      }));
      
      // Show success feedback
      const habit = habits.find(h => h.id === habitId);
      if (habit) {
        // You could add a toast notification here
        console.log(`✅ Completed: ${habit.name}`);
      }
      
    } catch (error) {
      console.error('Failed to mark habit complete:', error);
      if (error.response?.status === 400) {
        alert('This habit has already been completed today!');
      } else {
        alert('Failed to mark habit as completed. Please try again.');
      }
    } finally {
      setCompletingHabits(prev => {
        const newSet = new Set(prev);
        newSet.delete(habitId);
        return newSet;
      });
    }
  };

  const handleAddHabit = () => {
    navigate('/habits');
  };

  const fetchHabitCompletions = async (habitId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/habits/${habitId}/completions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data.completions.map(c => new Date(c.date));
    } catch (e) {
      return [];
    }
  };

  const calculateStreak = (dates) => {
    if (!dates.length) return 0;
    // Sort dates ascending
    const sorted = dates.map(d => new Date(d)).sort((a, b) => a - b);
    let streak = 1;
    for (let i = sorted.length - 1; i > 0; i--) {
      const diff = (sorted[i] - sorted[i - 1]) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else if (diff > 1) {
        break;
      }
    }
    // If last completion is not today, streak is 0
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const last = sorted[sorted.length - 1];
    last.setHours(0, 0, 0, 0);
    if (last.getTime() !== today.getTime()) streak = 0;
    return streak;
  };

  const fetchAllHabitCompletions = async (habits) => {
    const completionsObj = {};
    const statsObj = {};
    for (const habit of habits) {
      const dates = await fetchHabitCompletions(habit.id);
      completionsObj[habit.id] = dates;
      statsObj[habit.id] = {
        streak: calculateStreak(dates),
        total: dates.length
      };
    }
    setHabitCompletions(completionsObj);
    setHabitStats(statsObj);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.username}!</h1>
          <p>Here's your habit tracking progress</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Target />
            </div>
            <div className="stat-content">
              <h3>{stats.totalHabits}</h3>
              <p>Active Habits</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle />
            </div>
            <div className="stat-content">
              <h3>{stats.completedToday}</h3>
              <p>Completed Today</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp />
            </div>
            <div className="stat-content">
              <h3>{stats.streak}</h3>
              <p>Day Streak</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Award />
            </div>
            <div className="stat-content">
              <h3>{stats.totalXP}</h3>
              <p>Total XP</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="today-habits">
            <div className="section-header">
              <h2>Today's Habits</h2>
              <button className="btn btn-primary" onClick={handleAddHabit}>
                <Plus size={16} />
                Add Habit
              </button>
            </div>

            {habits.length === 0 ? (
              <div className="empty-state">
                <Target size={48} />
                <h3>No habits yet</h3>
                <p>Start building better habits by creating your first one!</p>
                <button className="btn btn-primary" onClick={handleAddHabit}>
                  <Plus size={16} />
                  Create Your First Habit
                </button>
              </div>
            ) : (
              <div className="habits-list">
                {habits.slice(0, 5).map((habit) => (
                  <div key={habit.id} className="habit-item">
                    <div className="habit-info">
                      <h4>{habit.name}</h4>
                      <p>{habit.description}</p>
                      <div className="habit-meta">
                        <span className="habit-category">{habit.category}</span>
                        <span className="habit-frequency">{habit.target_frequency}</span>
                      </div>
                    </div>
                    <div className="habit-actions">
                      <div className="difficulty-badge">
                        Level {habit.difficulty_level}
                      </div>
                      <button 
                        className={`btn ${completedToday.has(habit.id) ? 'btn-success' : 'btn-primary'}`}
                        onClick={() => markHabitComplete(habit.id)}
                        disabled={completedToday.has(habit.id) || completingHabits.has(habit.id) || !habit.is_active}
                        title={completedToday.has(habit.id) ? 'Completed today' : 'Mark as completed'}
                      >
                        <CheckCircle size={16} />
                        {completingHabits.has(habit.id) ? 'Completing...' :
                         completedToday.has(habit.id) ? 'Completed' : 'Complete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="quick-stats">
            <div className="section-header">
              <h2>Quick Stats</h2>
            </div>
            
            <div className="progress-card">
              <h4>Level Progress</h4>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(stats.totalXP % 100)}%` }}
                ></div>
              </div>
              <p>Level {user?.avatar_level || 1} - {stats.totalXP % 100}/100 XP</p>
            </div>

            <div className="recent-activity">
              <h4>Recent Activity</h4>
              <div className="activity-item">
                <Clock size={16} />
                <span>No recent activity</span>
              </div>
            </div>
          </div>

          <div className="progress-section">
            <ProgressWidget />
          </div>


        </div>
      </div>
    </div>
  );
};

export default Dashboard;