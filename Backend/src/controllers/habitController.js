require('dotenv').config();
const { Habit } = require('../models');
const { HabitCompletion } = require('../models');
const { Op } = require('sequelize');
const { checkMilestones } = require('./milestoneController');


const createHabit = async (req, res) => {
    try {
        const { name, description, category, difficulty_level, target_frequency } = req.body;
        const userID = req.user.id;

        if (!name || !description || !category || !difficulty_level || !target_frequency) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newHabit = await Habit.create({
            user_id: userID,
            name,
            description,
            category,
            difficulty_level,
            target_frequency,
            is_active: true
        });

        return res.status(201).json({ message: 'Habit created successfully', habit: newHabit });
    } catch (error) {
        console.error('Error creating habit:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getHabits = async (req, res) => {
    try {
        const userID = req.user.id;

        const habits = await Habit.findAll({
            where: { user_id: userID },
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json(habits);
    } catch (error) {
        console.error('Error fetching habits:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const updateHabit = async (req, res) => {
    try {
        const { habitId } = req.params;
        const { name, description, category, difficulty_level, target_frequency, is_active } = req.body;

        const habit = await Habit.findByPk(habitId);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        if (habit.user_id !== req.user.id) {
            return res.status(403).json({ message: 'You do not have permission to update this habit' });
        }

        if (name !== undefined) habit.name = name;
        if (description !== undefined) habit.description = description;
        if (category !== undefined) habit.category = category;
        if (difficulty_level !== undefined) habit.difficulty_level = difficulty_level;
        if (target_frequency !== undefined) habit.target_frequency = target_frequency;
        if (is_active !== undefined) habit.is_active = is_active;

        await habit.save();

        return res.status(200).json({ message: 'Habit updated successfully', habit });
    } catch (error) {
        console.error('Error updating habit:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const deleteHabit = async (req, res) => {
    try {
        const { habitId } = req.params;

        const habit = await Habit.findByPk(habitId);
        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        if (habit.user_id !== req.user.id) {
            return res.status(403).json({ message: 'You do not have permission to delete this habit' });
        }

        await habit.destroy();

        return res.status(200).json({ message: 'Habit deleted successfully' });
    } catch (error) {
        console.error('Error deleting habit:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Mark a habit as completed for a specific day (defaults to today)
 */
const markHabitComplete = async (req, res) => {
    try {
        const { habitId } = req.params;
        const userId = req.user.id;
        const { date } = req.body; // Optional, ISO string
        const completionDate = date ? new Date(date) : new Date();

        // Check if the habit belongs to the user
        const habit = await Habit.findByPk(habitId);
        if (!habit || habit.user_id !== userId) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        // Check if already completed for this day
        const startOfDay = new Date(completionDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(completionDate);
        endOfDay.setHours(23, 59, 59, 999);
        const existing = await HabitCompletion.findOne({
            where: {
                habit_id: habitId,
                completed_at: { [Op.between]: [startOfDay, endOfDay] }
            }
        });
        if (existing) {
            return res.status(400).json({ message: 'Habit already marked as completed for this day' });
        }

        // Create completion
        const completion = await HabitCompletion.create({
            habit_id: habitId,
            completed_at: completionDate
        });

        // Check for new milestones (but don't block the response)
        const milestoneController = require('./milestoneController');
        milestoneController.checkMilestones({ params: { habitId }, user: req.user }, {
            status: () => ({ json: () => {} }) // Mock response object
        }).catch(err => console.error('Error checking milestones:', err));

        return res.status(201).json({ message: 'Habit marked as completed', completion });
    } catch (error) {
        console.error('Error marking habit complete:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Get all completion dates for a habit (for calendar/streaks)
 */
const getHabitCompletions = async (req, res) => {
    try {
        const { habitId } = req.params;
        const userId = req.user.id;
        // Check if the habit belongs to the user
        const habit = await Habit.findByPk(habitId);
        if (!habit || habit.user_id !== userId) {
            return res.status(404).json({ message: 'Habit not found' });
        }
        // Get all completions for this habit
        const completions = await HabitCompletion.findAll({
            where: { habit_id: habitId },
            order: [['completed_at', 'ASC']]
        });
        // Return just the dates (and ids)
        return res.status(200).json({
            completions: completions.map(c => ({ id: c.id, date: c.completed_at }))
        });
    } catch (error) {
        console.error('Error fetching habit completions:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createHabit,
    getHabits,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    getHabitCompletions
};
