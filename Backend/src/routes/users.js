require('dotenv').config();
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, deleteUserProfile } = require('../controllers/userController');
const authenticateUser = require('../middleware/auth');

router.use(authenticateUser);

router.get('/', getUserProfile);
router.get('/profile', getUserProfile);
router.put('/', updateUserProfile);
router.delete('/', deleteUserProfile);

module.exports = router;