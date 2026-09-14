const express = require('express');
const router = express.Router();
const interviewController = require('../controllers/interviewController');
const { optionalAuth } = require('../middleware/auth');

/**
 * @route   GET /api/repositories/:id/questions
 * @desc    Get project-grounded question bank for repository
 */
router.get('/repositories/:id/questions', optionalAuth, interviewController.getQuestions);

/**
 * @route   GET /api/interviews/practice-weakness
 * @desc    Get targeted questions for identified candidate weakness areas
 */
router.get('/interviews/practice-weakness', optionalAuth, interviewController.getWeakAreaQuestions);

/**
 * @route   POST /api/interviews
 * @desc    Create a new mock interview session
 */
router.post('/interviews', optionalAuth, interviewController.createInterview);

/**
 * @route   GET /api/interviews/:id
 * @desc    Get active interview session details
 */
router.get('/interviews/:id', optionalAuth, interviewController.getInterviewById);

/**
 * @route   POST /api/interviews/:id/answer
 * @desc    Submit answer for a question & receive AI evaluation + adaptive follow-up
 */
router.post('/interviews/:id/answer', optionalAuth, interviewController.submitAnswer);

/**
 * @route   POST /api/interviews/:id/finish
 * @desc    Complete interview session & compute score breakdown and prep plan
 */
router.post('/interviews/:id/finish', optionalAuth, interviewController.finishInterview);

module.exports = router;
