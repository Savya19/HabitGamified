import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProgressVisualization.css';

const ProgressVisualization = () => {
    const [progress, setProgress] = useState(null);
    const [milestones, setMilestones] = useState([]);
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
                
                // Fetch milestones for current metaphor
                const milestonesResponse = await axios.get(
                    `/api/progress/milestones/${response.data.data.progress.metaphor_type}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                if (milestonesResponse.data.success) {
                    setMilestones(milestonesResponse.data.data);
                }
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const switchMetaphor = async (newType) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/progress/metaphor', 
                { metaphorType: newType },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
                fetchProgress();
            }
        } catch (error) {
            console.error('Error switching metaphor:', error);
        }
    };

    const getCurrentMilestone = () => {
        return milestones.find(m => m.stage === progress?.current_stage);
    };

    const getNextMilestone = () => {
        return milestones.find(m => m.stage === (progress?.current_stage + 1));
    };

    if (loading) {
        return <div className="progress-loading">Loading your progress...</div>;
    }

    const currentMilestone = getCurrentMilestone();
    const nextMilestone = getNextMilestone();

    return (
        <div className="progress-visualization">
            <div className="progress-header">
                <h2>Your Progress Journey</h2>
                <div className="metaphor-switcher">
                    <button 
                        className={progress?.metaphor_type === 'plant' ? 'active' : ''}
                        onClick={() => switchMetaphor('plant')}
                    >
                        🌱 Plant
                    </button>
                    <button 
                        className={progress?.metaphor_type === 'creature' ? 'active' : ''}
                        onClick={() => switchMetaphor('creature')}
                    >
                        🐣 Creature
                    </button>
                </div>
            </div>

            <div className="current-stage">
                <div className="stage-emoji">
                    {currentMilestone?.emoji || '🌱'}
                </div>
                <div className="stage-info">
                    <h3>{currentMilestone?.name || 'Getting Started'}</h3>
                    <p>{currentMilestone?.description || 'Begin your journey'}</p>
                    <div className="progress-bar">
                        <div 
                            className="progress-fill"
                            style={{ width: `${progress?.stage_progress || 0}%` }}
                        ></div>
                    </div>
                    <div className="progress-text">
                        {Math.round(progress?.stage_progress || 0)}% complete
                    </div>
                </div>
            </div>

            {nextMilestone && (
                <div className="next-milestone">
                    <h4>Next Milestone: {nextMilestone.emoji} {nextMilestone.name}</h4>
                    <p>{nextMilestone.description}</p>
                    <p>Complete {nextMilestone.required_completions} habits to unlock!</p>
                </div>
            )}

            <div className="milestones-timeline">
                <h4>Journey Timeline</h4>
                <div className="timeline">
                    {milestones.map((milestone, index) => (
                        <div 
                            key={milestone.id}
                            className={`timeline-item ${
                                milestone.stage <= progress?.current_stage ? 'completed' : 'locked'
                            }`}
                        >
                            <div className="timeline-emoji">{milestone.emoji}</div>
                            <div className="timeline-info">
                                <div className="timeline-name">{milestone.name}</div>
                                <div className="timeline-requirement">
                                    {milestone.required_completions} habits
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="progress-stats">
                <div className="stat">
                    <span className="stat-number">{progress?.milestones_completed || 0}</span>
                    <span className="stat-label">Milestones Completed</span>
                </div>
                <div className="stat">
                    <span className="stat-number">{progress?.current_stage || 1}</span>
                    <span className="stat-label">Current Stage</span>
                </div>
            </div>
        </div>
    );
};

export default ProgressVisualization;