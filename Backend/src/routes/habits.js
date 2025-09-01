require('dotenv').config();
const express = require('express');
const router = express.Router();
const { createHabit, getHabits, updateHabit, deleteHabit } = require('../controllers/habitController');
const { checkMilestones, getHabitStats, getHabitCalendar } = require('../controllers/milestoneController');
const authenticateUser = require('../middleware/auth');

router.use(authenticateUser);

router.post('/', createHabit);
router.get('/', getHabits);
router.put('/:habitId', updateHabit);
router.delete('/:habitId', deleteHabit);
router.post('/:habitId/complete', require('../controllers/habitController').markHabitComplete);
router.get('/:habitId/completions', require('../controllers/habitController').getHabitCompletions);

// Milestone and stats routes
router.get('/:habitId/milestones', checkMilestones);
router.get('/:habitId/stats', getHabitStats);
router.get('/:habitId/calendar', getHabitCalendar);

module.exports = router;
