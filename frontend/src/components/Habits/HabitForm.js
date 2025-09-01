import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

const HabitForm = ({ habit, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'General',
    difficulty_level: 1,
    target_frequency: 'Daily',
    is_active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name || '',
        description: habit.description || '',
        category: habit.category || 'General',
        difficulty_level: habit.difficulty_level || 1,
        target_frequency: habit.target_frequency || 'Daily',
        is_active: habit.is_active !== undefined ? habit.is_active : true
      });
    }
  }, [habit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save habit');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'General',
    'Health',
    'Fitness',
    'Learning',
    'Productivity',
    'Social',
    'Mindfulness',
    'Creative'
  ];

  const frequencies = [
    'Daily',
    'Weekly',
    'Bi-weekly',
    'Monthly'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{habit ? 'Edit Habit' : 'Create New Habit'}</h2>
          <button className="modal-close" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="habit-form">
          <div className="form-group">
            <label className="form-label">Habit Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g., Drink 8 glasses of water"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Describe your habit and why it's important to you..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty Level</label>
              <select
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleChange}
                className="form-select"
              >
                <option value={1}>Level 1 - Easy</option>
                <option value={2}>Level 2 - Medium</option>
                <option value={3}>Level 3 - Hard</option>
                <option value={4}>Level 4 - Very Hard</option>
                <option value={5}>Level 5 - Extreme</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Target Frequency</label>
              <select
                name="target_frequency"
                value={formData.target_frequency}
                onChange={handleChange}
                className="form-select"
              >
                {frequencies.map(frequency => (
                  <option key={frequency} value={frequency}>
                    {frequency}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span className="checkbox-text">Active habit</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  {habit ? 'Update Habit' : 'Create Habit'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;