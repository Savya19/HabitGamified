require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');
const crypto = require('crypto');

/**
 * Request password reset - generates reset token and sends email (simulated)
 */
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            // Don't reveal if email exists or not for security
            return res.status(200).json({ 
                message: 'If an account with that email exists, a password reset link has been sent.' 
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

        // Save reset token to user (you might want to create a separate table for this)
        await user.update({
            reset_token: resetToken,
            reset_token_expiry: resetTokenExpiry
        });

        // In a real app, you would send an email here
        // For demo purposes, we'll just log the reset link
        console.log(`Password reset link for ${email}: http://localhost:3000/reset-password/${resetToken}`);

        return res.status(200).json({ 
            message: 'If an account with that email exists, a password reset link has been sent.',
            // In development, include the token for testing
            ...(process.env.NODE_ENV === 'development' && { resetToken })
        });

    } catch (error) {
        console.error('Error requesting password reset:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Reset password using token
 */
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: 'Token and new password are required' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        // Find user with valid reset token
        const user = await User.findOne({
            where: {
                reset_token: token,
                reset_token_expiry: {
                    [Op.gt]: new Date() // Token not expired
                }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update user password and clear reset token
        await user.update({
            password: hashedPassword,
            reset_token: null,
            reset_token_expiry: null
        });

        return res.status(200).json({ message: 'Password has been reset successfully' });

    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Verify reset token validity
 */
const verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            where: {
                reset_token: token,
                reset_token_expiry: {
                    [Op.gt]: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        return res.status(200).json({ message: 'Token is valid', email: user.email });

    } catch (error) {
        console.error('Error verifying reset token:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    requestPasswordReset,
    resetPassword,
    verifyResetToken
};