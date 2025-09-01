const express = require('express');
const router = express.Router();
const { 
    requestPasswordReset, 
    resetPassword, 
    verifyResetToken 
} = require('../controllers/passwordResetController');

// Request password reset
router.post('/request', requestPasswordReset);

// Reset password with token
router.post('/reset', resetPassword);

// Verify reset token
router.get('/verify/:token', verifyResetToken);

module.exports = router;