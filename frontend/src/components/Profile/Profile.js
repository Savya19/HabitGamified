import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Award, Calendar, Edit, Save, X } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // This would typically make an API call to update the user profile
      // await axios.put('/api/users/profile', formData);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  const getXPForNextLevel = () => {
    const currentLevel = user?.avatar_level || 1;
    return currentLevel * 100; // Simple calculation
  };

  const getCurrentLevelXP = () => {
    const totalXP = user?.total_xp || 0;
    const currentLevel = user?.avatar_level || 1;
    const previousLevelXP = (currentLevel - 1) * 100;
    return totalXP - previousLevelXP;
  };

  const getXPProgress = () => {
    const currentXP = getCurrentLevelXP();
    const nextLevelXP = 100; // XP needed for next level
    return (currentXP / nextLevelXP) * 100;
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account settings and view your progress</p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="profile-info">
                <h2>{user?.username}</h2>
                <p>{user?.email}</p>
                <div className="profile-level">
                  <Award size={16} />
                  <span>Level {user?.avatar_level || 1}</span>
                </div>
              </div>
              {!isEditing && (
                <button 
                  className="btn btn-outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              )}
            </div>

            {message && (
              <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-error'}`}>
                {message}
              </div>
            )}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label className="form-label">
                    <User size={16} />
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail size={16} />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-item">
                  <User size={16} />
                  <div>
                    <span className="detail-label">Username</span>
                    <span className="detail-value">{user?.username}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Mail size={16} />
                  <div>
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{user?.email}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <div>
                    <span className="detail-label">Member Since</span>
                    <span className="detail-value">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="stats-card">
            <h3>Your Progress</h3>
            
            <div className="level-progress">
              <div className="level-info">
                <h4>Level {user?.avatar_level || 1}</h4>
                <p>{getCurrentLevelXP()}/100 XP</p>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getXPProgress()}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {100 - getCurrentLevelXP()} XP until Level {(user?.avatar_level || 1) + 1}
              </p>
            </div>

            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">
                  <Award />
                </div>
                <div className="stat-content">
                  <h4>{user?.total_xp || 0}</h4>
                  <p>Total XP</p>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">
                  <Calendar />
                </div>
                <div className="stat-content">
                  <h4>0</h4>
                  <p>Days Active</p>
                </div>
              </div>
            </div>

            <div className="achievements-section">
              <h4>Recent Achievements</h4>
              <div className="achievements-list">
                <div className="achievement-placeholder">
                  <Award size={24} />
                  <p>No achievements yet. Start completing habits to earn your first achievement!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;