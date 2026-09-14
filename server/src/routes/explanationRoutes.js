const express = require('express');
const router = express.Router();
const explanationController = require('../controllers/explanationController');
const { optionalAuth } = require('../middleware/auth');

/**
 * @route   GET /api/repositories/:id/explanation
 * @desc    Get project explanation pitches for repository
 */
router.get('/:id/explanation', optionalAuth, explanationController.getExplanation);

/**
 * @route   POST /api/repositories/:id/explanation/generate
 * @desc    Generate/regenerate project explanation pitches
 */
router.post('/:id/explanation/generate', optionalAuth, explanationController.generateExplanation);

/**
 * @route   POST /api/repositories/:id/explanation/evaluate
 * @desc    Evaluate candidate's spoken/written project explanation pitch
 */
router.post('/:id/explanation/evaluate', optionalAuth, explanationController.evaluateExplanation);

module.exports = router;
