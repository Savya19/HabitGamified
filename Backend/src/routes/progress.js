const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Get user's current progress
router.get('/', progressController.getUserProgress);

// Update progress (called after habit completion)
router.post('/update', progressController.updateProgress);

// Switch metaphor type (plant/creature)
router.post('/metaphor', progressController.switchMetaphor);

// Get milestones for a metaphor type
router.get('/milestones/:metaphorType', progressController.getMilestones);

module.exports = router;