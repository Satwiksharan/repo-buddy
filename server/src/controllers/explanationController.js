const aiService = require('../ai/aiService');
const repoStore = require('../services/repoStore');

/**
 * Generate Project Explanation Pitches
 */
const generateExplanation = async (req, res) => {
  const { id } = req.params;

  try {
    const { scanResult } = await repoStore.getOrScanRepo(id, req.user?.githubAccessToken);

    const explanationRes = await aiService.generateProjectExplanation(scanResult.projectContext);

    return res.status(200).json({
      success: true,
      repositoryId: id,
      data: explanationRes.data
    });
  } catch (error) {
    console.error('[ExplanationController Error]:', error.message);
    return res.status(500).json({
      success: false,
      error: { code: 'EXPLANATION_GENERATION_FAILED', message: error.message }
    });
  }
};

/**
 * Get Saved Project Explanation Pitches
 */
const getExplanation = async (req, res) => {
  return generateExplanation(req, res);
};

/**
 * Evaluate Candidate's Project Explanation Pitch Response
 */
const evaluateExplanation = async (req, res) => {
  const { id } = req.params;
  const { answer } = req.body;

  if (!answer || typeof answer !== 'string' || !answer.trim()) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: 'Candidate explanation answer is required.' }
    });
  }

  try {
    const { scanResult } = await repoStore.getOrScanRepo(id, req.user?.githubAccessToken);

    const evalResult = await aiService.evaluateProjectExplanation(scanResult.projectContext, answer);

    return res.status(200).json({
      success: true,
      repositoryId: id,
      data: evalResult.data
    });
  } catch (error) {
    console.error('[ExplanationController Evaluate Error]:', error.message);
    return res.status(500).json({
      success: false,
      error: { code: 'EVALUATION_FAILED', message: error.message }
    });
  }
};

module.exports = {
  generateExplanation,
  getExplanation,
  evaluateExplanation
};
