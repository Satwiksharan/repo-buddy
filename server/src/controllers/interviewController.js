const interviewService = require('../services/interviewService');
const repoStore = require('../services/repoStore');

/**
 * Get Question Bank for Repository
 */
const getQuestions = async (req, res) => {
  const { id } = req.params;
  try {
    const { repo, scanResult } = await repoStore.getOrScanRepo(id);
    const questions = await interviewService.generateQuestionsForRepository(repo.githubId, scanResult.projectContext);
    return res.status(200).json({ success: true, count: questions.length, data: questions });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

/**
 * Create New Mock Interview Session
 */
const createInterview = async (req, res) => {
  const { repositoryId } = req.body;
  try {
    const interview = await interviewService.createInterview(req.user?._id, repositoryId || '101');
    return res.status(201).json({ success: true, data: interview });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'INTERVIEW_CREATION_FAILED', message: error.message } });
  }
};

/**
 * Get Active Mock Interview Details
 */
const getInterviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const interview = await interviewService.createInterview(req.user?._id, id);
    return res.status(200).json({ success: true, data: interview });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

/**
 * Submit Candidate Answer for Evaluation & Adaptive Follow-up
 */
const submitAnswer = async (req, res) => {
  const { id } = req.params;
  const { questionIndex, answer } = req.body;

  if (answer === undefined || answer === null || !String(answer).trim()) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: 'Candidate answer text is required.' }
    });
  }

  try {
    const evaluation = await interviewService.evaluateAnswer(id, questionIndex, String(answer));
    return res.status(200).json({
      success: true,
      interviewId: id,
      questionIndex,
      data: evaluation
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'ANSWER_EVALUATION_FAILED', message: error.message } });
  }
};

/**
 * Finish Interview Session & Compute Final Scores + Weaknesses
 */
const finishInterview = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await interviewService.finishInterview(id);
    return res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'FINISH_INTERVIEW_FAILED', message: error.message } });
  }
};

/**
 * Get Targeted Questions for Practicing Identified Weak Areas
 */
const getWeakAreaQuestions = async (req, res) => {
  const { category } = req.query;
  try {
    const questions = await interviewService.generateWeakAreaQuestions(category || 'Database');
    return res.status(200).json({
      success: true,
      category: category || 'Database',
      count: questions.length,
      data: questions
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

module.exports = {
  getQuestions,
  createInterview,
  getInterviewById,
  submitAnswer,
  finishInterview,
  getWeakAreaQuestions
};
