const express = require('express');
const router = express.Router();
const repositoryController = require('../controllers/repositoryController');
const { requireAuth, optionalAuth } = require('../middleware/auth');

/**
 * @route   GET /api/repositories
 * @desc    Get user's scanned repository records
 */
router.get('/', requireAuth, repositoryController.getAnalyzedRepositories);

/**
 * @route   POST /api/repositories/:id/scan
 * @desc    Trigger scan & technology/architecture analysis for repository
 */
router.post('/:id/scan', optionalAuth, repositoryController.scanRepository);

/**
 * @route   GET /api/repositories/:id/analysis
 * @desc    Get detailed analysis report for repository
 */
router.get('/:id/analysis', optionalAuth, repositoryController.getRepositoryAnalysis);

module.exports = router;
