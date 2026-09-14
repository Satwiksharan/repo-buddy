const progressService = require('../services/progressService');

/**
 * Get Candidate Global Progress Analytics
 */
const getGlobalProgress = async (req, res) => {
  try {
    const progress = await progressService.getProgressMetrics(req.user?._id);
    return res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 'PROGRESS_FETCH_FAILED', message: error.message }
    });
  }
};

/**
 * Get Repository Specific Progress Analytics
 */
const getRepositoryProgress = async (req, res) => {
  const { id } = req.params;
  try {
    const progress = await progressService.getProgressMetrics(req.user?._id, id);
    return res.status(200).json({
      success: true,
      repositoryId: id,
      data: progress
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 'REPO_PROGRESS_FETCH_FAILED', message: error.message }
    });
  }
};

module.exports = {
  getGlobalProgress,
  getRepositoryProgress
};
