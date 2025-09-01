const { UserProgress, Milestone, User, HabitCompletion } = require('../models');

const progressController = {
    // Get user's current progress
    async getUserProgress(req, res) {
        try {
            const userId = req.user.id;
            
            let progress = await UserProgress.findOne({
                where: { user_id: userId },
                include: [
                    {
                        model: User,
                        attributes: ['username', 'total_xp']
                    }
                ]
            });

            // Create default progress if doesn't exist
            if (!progress) {
                progress = await UserProgress.create({
                    user_id: userId,
                    metaphor_type: 'plant',
                    current_stage: 1,
                    stage_progress: 0.0,
                    milestones_completed: 0
                });
            }

            // Get current milestone info
            const currentMilestone = await Milestone.findOne({
                where: {
                    metaphor_type: progress.metaphor_type,
                    stage: progress.current_stage
                }
            });

            res.json({
                success: true,
                data: {
                    progress,
                    currentMilestone
                }
            });
        } catch (error) {
            console.error('Error fetching user progress:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch progress'
            });
        }
    },

    // Update progress based on habit completions
    async updateProgress(req, res) {
        try {
            const userId = req.user.id;
            
            // Get total habit completions
            const totalCompletions = await HabitCompletion.count({
                include: [{
                    model: require('../models').Habit,
                    where: { user_id: userId }
                }]
            });

            let progress = await UserProgress.findOne({
                where: { user_id: userId }
            });

            if (!progress) {
                progress = await UserProgress.create({
                    user_id: userId,
                    metaphor_type: 'plant',
                    current_stage: 1,
                    stage_progress: 0.0,
                    milestones_completed: 0
                });
            }

            // Calculate new stage and progress
            const currentMilestone = await Milestone.findOne({
                where: {
                    metaphor_type: progress.metaphor_type,
                    stage: progress.current_stage
                }
            });

            if (currentMilestone) {
                const progressPercent = Math.min(
                    (totalCompletions / currentMilestone.required_completions) * 100,
                    100
                );

                let newStage = progress.current_stage;
                let milestonesCompleted = progress.milestones_completed;

                // Check if milestone is completed
                if (progressPercent >= 100) {
                    newStage += 1;
                    milestonesCompleted += 1;
                    
                    // Award XP
                    await User.increment('total_xp', {
                        by: currentMilestone.xp_reward,
                        where: { id: userId }
                    });
                }

                await progress.update({
                    current_stage: newStage,
                    stage_progress: progressPercent >= 100 ? 0 : progressPercent,
                    milestones_completed: milestonesCompleted,
                    last_milestone_date: progressPercent >= 100 ? new Date() : progress.last_milestone_date,
                    updated_at: new Date()
                });
            }

            res.json({
                success: true,
                data: progress
            });
        } catch (error) {
            console.error('Error updating progress:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to update progress'
            });
        }
    },

    // Switch metaphor type
    async switchMetaphor(req, res) {
        try {
            const userId = req.user.id;
            const { metaphorType } = req.body;

            if (!['plant', 'creature'].includes(metaphorType)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid metaphor type'
                });
            }

            let progress = await UserProgress.findOne({
                where: { user_id: userId }
            });

            if (!progress) {
                progress = await UserProgress.create({
                    user_id: userId,
                    metaphor_type: metaphorType,
                    current_stage: 1,
                    stage_progress: 0.0,
                    milestones_completed: 0
                });
            } else {
                await progress.update({
                    metaphor_type: metaphorType,
                    current_stage: 1,
                    stage_progress: 0.0,
                    updated_at: new Date()
                });
            }

            res.json({
                success: true,
                data: progress
            });
        } catch (error) {
            console.error('Error switching metaphor:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to switch metaphor'
            });
        }
    },

    // Get all milestones for a metaphor type
    async getMilestones(req, res) {
        try {
            const { metaphorType } = req.params;
            
            const milestones = await Milestone.findAll({
                where: { metaphor_type: metaphorType },
                order: [['stage', 'ASC']]
            });

            res.json({
                success: true,
                data: milestones
            });
        } catch (error) {
            console.error('Error fetching milestones:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch milestones'
            });
        }
    }
};

module.exports = progressController;