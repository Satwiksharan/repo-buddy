const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

/**
 * @route   GET /api/auth/github
 * @desc    Initiate GitHub OAuth login flow
 */
router.get('/github', authController.initiateGithubLogin);

/**
 * @route   GET /api/auth/github/callback
 * @desc    GitHub OAuth callback landing page
 */
router.get('/github/callback', authController.handleGithubCallback);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently logged in user profile
 */
router.get('/me', requireAuth, authController.getCurrentUser);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user & clear auth session cookies
 */
router.post('/logout', authController.logout);

module.exports = router;
