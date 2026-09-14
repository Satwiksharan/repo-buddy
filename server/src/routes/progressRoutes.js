const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const { optionalAuth } = require('../middleware/auth');

/**
 * @route   GET /api/progress
 * @desc    Get candidate global progress metrics
 */
router.get('/progress', optionalAuth, progressController.getGlobalProgress);

/**
 * @route   GET /api/repositories/:id/progress
 * @desc    Get repository-specific progress metrics
 */
router.get('/repositories/:id/progress', optionalAuth, progressController.getRepositoryProgress);

module.exports = router;
