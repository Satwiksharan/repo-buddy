const express = require('express');
const router = express.Router();
const repositoryController = require('../controllers/repositoryController');
const { optionalAuth } = require('../middleware/auth');

/**
 * @route   GET /api/analysis/:id
 * @desc    Get detailed analysis report
 */
router.get('/:id', optionalAuth, repositoryController.getRepositoryAnalysis);

module.exports = router;
