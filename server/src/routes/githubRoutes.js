const express = require('express');
const router = express.Router();
const githubController = require('../controllers/githubController');
const { requireAuth } = require('../middleware/auth');

/**
 * @route   GET /api/github/repositories
 * @desc    Fetch authenticated user's GitHub repositories
 */
router.get('/repositories', requireAuth, githubController.getUserRepositories);

/**
 * @route   GET /api/github/repositories/:id
 * @desc    Fetch single repository details by GitHub ID
 */
router.get('/repositories/:id', requireAuth, githubController.getRepositoryById);

/**
 * @route   POST /api/github/import
 * @desc    Import any public GitHub repository or user repos
 */
router.post('/import', githubController.importRepository);

module.exports = router;
