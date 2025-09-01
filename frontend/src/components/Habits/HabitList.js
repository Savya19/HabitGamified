import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Target, Filter, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import HabitForm from './HabitForm';

const HabitList = () => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [filter, setFilter] = useState('all');
  const [completedToday, setCompletedToday] = useState(new Set());
  const [completingHabits, setCompletingHabits] = useState(new Set());

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/habits', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHabits(response.data);
      
      // Check which habits are completed today
      const today = new Date();
      const completedSet = new Set();
      
      for (const habit of response.data) {
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
          }
        } catch (err) {
          console.error(`Failed to fetch completions for habit ${habit.id}:`, err);
        }
      }
      
      setCompletedToday(completedSet);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHabit = () => {
    setEditingHabit(null);
    setShowForm(true);
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const handleDeleteHabit = async (habitId) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      try {
        await axios.delete(`/api/habits/${habitId}`);
        fetchHabits();
      } catch (error) {
        console.error('Failed to delete habit:', error);
      }
    }
  };

  const handleFormSubmit = async (habitData) => {
    try {
      const token = localStorage.getItem('token');
      if (editingHabit) {
        await axios.put(`/api/habits/${editingHabit.id}`, habitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/habits', habitData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setShowForm(false);
      setEditingHabit(null);
      fetchHabits();
    } catch (error) {
      console.error('Failed to save habit:', error);
      throw error;
    }
  };

  const handleCompleteHabit = async (habitId) => {
    if (completedToday.has(habitId) || completingHabits.has(habitId)) return;
    
    try {
      setCompletingHabits(prev => new Set([...prev, habitId]));
      const token = localStorage.getItem('token');
      
      await axios.post(`/api/habits/${habitId}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update progress after habit completion
      await axios.post('/api/progress/update', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCompletedToday(prev => new Set([...prev, habitId]));
      
    } catch (err) {
      console.error('Error completing habit:', err);
      alert('Failed to mark habit as completed');
    } finally {
      setCompletingHabits(prev => {
        const newSet = new Set(prev);
        newSet.delete(habitId);
        return newSet;
      });
    }
  };

  const handleViewDetails = (habitId) => {
    navigate(`/habits/${habitId}`);
  };

  const filteredHabits = habits.filter(habit => {
    if (filter === 'active') return habit.is_active;
    if (filter === 'inactive') return !habit.is_active;
    return true;
  });

  if (loading) {
    return (
      <div className="habits-loading">
        <div className="loading-spinner"></div>
        <p>Loading your habits...</p>
      </div>
    );
  }

  return (
    <div className="habits-page">
      <div className="habits-container">
        <div className="habits-header">
          <div>
            <h1>My Habits</h1>
            <p>Manage and track your daily habits</p>
          </div>
          <button className="btn btn-primary" onClick={handleCreateHabit}>
            <Plus size={16} />
            Add New Habit
          </button>
        </div>

        <div className="habits-controls">
          <div className="filter-controls">
            <Filter size={16} />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Habits</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          <div className="habits-count">
            {filteredHabits.length} habit{filteredHabits.length !== 1 ? 's' : ''}
          </div>
        </div>

        {filteredHabits.length === 0 ? (
          <div className="empty-habits">
            <Target size={64} />
            <h3>No habits found</h3>
            <p>
              {filter === 'all' 
                ? "Start building better habits by creating your first one!"
                : `No ${filter} habits found. Try changing your filter.`
              }
            </p>
            {filter === 'all' && (
              <button className="btn btn-primary" onClick={handleCreateHabit}>
                <Plus size={16} />
                Create Your First Habit
              </button>
            )}
          </div>
        ) : (
          <div className="habits-grid">
            {filteredHabits.map((habit) => (
              <div key={habit.id} className={`habit-card ${!habit.is_active ? 'inactive' : ''}`}>
                <div className="habit-card-header">
                  <h3>{habit.name}</h3>
                  <div className="habit-actions">
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEditHabit(habit)}
                      title="Edit habit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => handleDeleteHabit(habit.id)}
                      title="Delete habit"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="habit-description">{habit.description}</p>

                <div className="habit-details">
                  <div className="habit-detail">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value category-badge">{habit.category}</span>
                  </div>
                  <div className="habit-detail">
                    <span className="detail-label">Frequency:</span>
                    <span className="detail-value">{habit.target_frequency}</span>
                  </div>
                  <div className="habit-detail">
                    <span className="detail-label">Difficulty:</span>
                    <span className="detail-value difficulty-badge">
                      Level {habit.difficulty_level}
                    </span>
                  </div>
                  <div className="habit-detail">
                    <span className="detail-label">Status:</span>
                    <span className={`detail-value status-badge ${habit.is_active ? 'active' : 'inactive'}`}>
                      {habit.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="habit-footer">
                  <div className="habit-footer-left">
                    <small>Created: {new Date(habit.created_at).toLocaleDateString()}</small>
                  </div>
                  <div className="habit-footer-actions">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => handleViewDetails(habit.id)}
                      title="View details and calendar"
                    >
                      <Calendar size={14} />
                      Details
                    </button>
                    <button
                      className={`btn btn-sm ${completedToday.has(habit.id) ? 'btn-success' : 'btn-primary'}`}
                      onClick={() => handleCompleteHabit(habit.id)}
                      disabled={completedToday.has(habit.id) || completingHabits.has(habit.id) || !habit.is_active}
                      title={completedToday.has(habit.id) ? 'Completed today' : 'Mark as completed'}
                    >
                      <CheckCircle size={14} />
                      {completingHabits.has(habit.id) ? 'Completing...' :
                       completedToday.has(habit.id) ? 'Completed' : 'Complete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <HabitForm
            habit={editingHabit}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingHabit(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HabitList;