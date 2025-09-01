import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, Star } from 'lucide-react';
import './ProgressWidget.css';

const ProgressWidget = () => {
    const [progress, setProgress] = useState(null);
    const [currentMilestone, setCurrentMilestone] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProgress();
    }, []);

    const fetchProgress = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/progress', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.success) {
                setProgress(response.data.data.progress);
                setCurrentMilestone(response.data.data.currentMilestone);
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="progress-widget loading">
                <div className="widget-header">
                    <TrendingUp size={20} />
                    <h3>Progress</h3>
                </div>
                <div className="loading-content">Loading...</div>
            </div>
        );
    }

    return (
        <div className="progress-widget">
            <div className="widget-header">
                <TrendingUp size={20} />
                <h3>Your Journey</h3>
                <Link to="/progress" className="view-all-link">
                    View All
                </Link>
            </div>
            
            <div className="current-stage-mini">
                <div className="stage-emoji-large">
                    {currentMilestone?.emoji || '🌱'}
                </div>
                <div className="stage-details">
                    <h4>{currentMilestone?.name || 'Getting Started'}</h4>
                    <div className="progress-bar-mini">
                        <div 
                            className="progress-fill-mini"
                            style={{ width: `${progress?.stage_progress || 0}%` }}
                        ></div>
                    </div>
                    <div className="progress-text-mini">
                        {Math.round(progress?.stage_progress || 0)}% to next milestone
                    </div>
                </div>
            </div>

            <div className="milestone-info">
                <div className="milestone-stat">
                    <Star size={16} />
                    <span>{progress?.milestones_completed || 0} milestones completed</span>
                </div>
                <div className="metaphor-type">
                    {progress?.metaphor_type === 'plant' ? '🌱 Plant Journey' : '🐣 Creature Journey'}
                </div>
            </div>
        </div>
    );
};

export default ProgressWidget;