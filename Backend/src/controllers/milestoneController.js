require('dotenv').config();
const { Habit, HabitCompletion, Achievement, UserAchievement } = require('../models');
const { Op } = require('sequelize');

/**
 * Predefined milestones for habit streaks
 */
const MILESTONE_DEFINITIONS = [
    { days: 3, name: "First Steps", description: "Complete a habit for 3 consecutive days", xp: 50, icon: "🌱" },
    { days: 7, name: "Week Warrior", description: "Complete a habit for 7 consecutive days", xp: 100, icon: "⚡" },
    { days: 14, name: "Two Week Champion", description: "Complete a habit for 14 consecutive days", xp: 200, icon: "🔥" },
    { days: 21, name: "Habit Former", description: "Complete a habit for 21 consecutive days", xp: 300, icon: "💎" },
    { days: 30, name: "Monthly Master", description: "Complete a habit for 30 consecutive days", xp: 500, icon: "👑" },
    { days: 60, name: "Consistency King", description: "Complete a habit for 60 consecutive days", xp: 750, icon: "🏆" },
    { days: 90, name: "Habit Legend", description: "Complete a habit for 90 consecutive days", xp: 1000, icon: "🌟" },
    { days: 180, name: "Half Year Hero", description: "Complete a habit for 180 consecutive days", xp: 1500, icon: "🎯" },
    { days: 365, name: "Year Long Achiever", description: "Complete a habit for 365 consecutive days", xp: 2500, icon: "🎊" }
];

/**
 * Calculate current streak for a habit
 */
const calculateStreak = async (habitId) => {
    const completions = await HabitCompletion.findAll({
        where: { habit_id: habitId },
        order: [['completed_at', 'DESC']]
    });

    if (completions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let completion of completions) {
        const completionDate = new Date(completion.completed_at);
        completionDate.setHours(0, 0, 0, 0);

        const daysDiff = Math.floor((currentDate - completionDate) / (1000 * 60 * 60 * 24));

        if (daysDiff === streak) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (daysDiff === streak + 1 && streak === 0) {
            // Allow for today not being completed yet
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
};

/**
 * Check and award milestones for a habit
 */
const checkMilestones = async (req, res) => {
    try {
        const { habitId } = req.params;
        const userId = req.user.id;

        // Verify habit ownership
        const habit = await Habit.findByPk(habitId);
        if (!habit || habit.user_id !== userId) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const currentStreak = await calculateStreak(habitId);
        const newMilestones = [];

        // Check each milestone
        for (const milestone of MILESTONE_DEFINITIONS) {
            if (currentStreak >= milestone.days) {
                // Check if user already has this milestone for this habit
                const existingAchievement = await Achievement.findOne({
                    where: {
                        name: `${milestone.name} - ${habit.name}`,
                        unlock_condition: `streak_${milestone.days}_${habitId}`
                    }
                });

                if (!existingAchievement) {
                    // Create achievement
                    const achievement = await Achievement.create({
                        name: `${milestone.name} - ${habit.name}`,
                        description: `${milestone.description} for "${habit.name}"`,
                        icon: milestone.icon,
                        xp_reward: milestone.xp,
                        unlock_condition: `streak_${milestone.days}_${habitId}`
                    });

                    // Award to user
                    await UserAchievement.create({
                        user_id: userId,
                        achievement_id: achievement.id
                    });

                    newMilestones.push({
                        ...milestone,
                        achievementId: achievement.id
                    });
                }
            }
        }

        return res.status(200).json({
            currentStreak,
            newMilestones,
            message: newMilestones.length > 0 ? 'New milestones achieved!' : 'No new milestones'
        });
    } catch (error) {
        console.error('Error checking milestones:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Get habit statistics including streak and milestones
 */
const getHabitStats = async (req, res) => {
    try {
        const { habitId } = req.params;
        const userId = req.user.id;

        // Verify habit ownership
        const habit = await Habit.findByPk(habitId);
        if (!habit || habit.user_id !== userId) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const currentStreak = await calculateStreak(habitId);

        // Get total completions
        const totalCompletions = await HabitCompletion.count({
            where: { habit_id: habitId }
        });

        // Get achieved milestones
        const userAchievements = await UserAchievement.findAll({
            where: { user_id: userId },
            include: [{
                model: Achievement,
                where: {
                    unlock_condition: {
                        [Op.like]: `%${habitId}`
                    }
                },
                required: true
            }]
        });

        // Get next milestone
        const nextMilestone = MILESTONE_DEFINITIONS.find(m => m.days > currentStreak);

        return res.status(200).json({
            habitId,
            habitName: habit.name,
            currentStreak,
            totalCompletions,
            achievements: userAchievements.map(ua => ({
                id: ua.Achievement.id,
                name: ua.Achievement.name,
                description: ua.Achievement.description,
                icon: ua.Achievement.icon,
                xp_reward: ua.Achievement.xp_reward,
                unlocked_at: ua.unlocked_at
            })),
            nextMilestone: nextMilestone ? {
                ...nextMilestone,
                daysRemaining: nextMilestone.days - currentStreak
            } : null
        });
    } catch (error) {
        console.error('Error getting habit stats:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Get calendar data for a habit (completion status for each day)
 */
const getHabitCalendar = async (req, res) => {
    try {
        const { habitId } = req.params;
        const { year, month } = req.query;
        const userId = req.user.id;

        // Verify habit ownership
        const habit = await Habit.findByPk(habitId);
        if (!habit || habit.user_id !== userId) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Default to current month if not specified
        const targetYear = year ? parseInt(year) : new Date().getFullYear();
        const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;

        // Get start and end of month
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

        // Get all completions for this month
        const completions = await HabitCompletion.findAll({
            where: {
                habit_id: habitId,
                completed_at: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [['completed_at', 'ASC']]
        });

        // Create calendar data
        const calendarData = {};
        completions.forEach(completion => {
            const date = new Date(completion.completed_at);
            const day = date.getDate();
            calendarData[day] = {
                completed: true,
                completionId: completion.id,
                notes: completion.notes
            };
        });

        return res.status(200).json({
            year: targetYear,
            month: targetMonth,
            habitName: habit.name,
            calendarData,
            totalDaysInMonth: endDate.getDate(),
            completedDays: Object.keys(calendarData).length
        });
    } catch (error) {
        console.error('Error getting habit calendar:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    checkMilestones,
    getHabitStats,
    getHabitCalendar,
    calculateStreak
};