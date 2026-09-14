const Repository = require('../models/Repository');
const Scan = require('../models/Scan');
const repoStore = require('../services/repoStore');

/**
 * Scan a Repository & Generate Technical Analysis Report
 */
const scanRepository = async (req, res) => {
  const { id } = req.params;

  try {
    const { repo, scanResult } = await repoStore.getOrScanRepo(id, req.user?.githubAccessToken);

    return res.status(200).json({
      success: true,
      data: {
        repositoryId: repo.githubId,
        githubId: repo.githubId,
        name: repo.name,
        fullName: repo.fullName,
        healthScore: scanResult.healthScore,
        architecture: scanResult.architecture,
        technologies: scanResult.technologies,
        importantFiles: scanResult.importantFiles,
        projectContext: scanResult.projectContext,
        scannedAt: new Date()
      }
    });
  } catch (error) {
    console.error('[RepositoryController Scan Error]:', error.message);
    return res.status(500).json({
      success: false,
      error: { code: 'SCAN_FAILED', message: error.message }
    });
  }
};

/**
 * Fetch Analysis for Repository
 */
const getRepositoryAnalysis = async (req, res) => {
  const { id } = req.params;

  try {
    const { repo, scanResult } = await repoStore.getOrScanRepo(id, req.user?.githubAccessToken);

    return res.status(200).json({
      success: true,
      data: {
        githubId: repo.githubId,
        name: repo.name,
        fullName: repo.fullName,
        healthScore: scanResult.healthScore,
        architecture: scanResult.architecture,
        technologies: scanResult.technologies,
        importantFiles: scanResult.importantFiles,
        projectContext: scanResult.projectContext
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 'ANALYSIS_FETCH_FAILED', message: error.message }
    });
  }
};

/**
 * List User Analyzed Repositories
 */
const getAnalyzedRepositories = async (req, res) => {
  try {
    const list = repoStore.listRepos();
    return res.status(200).json({ success: true, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
};

module.exports = {
  scanRepository,
  getRepositoryAnalysis,
  getAnalyzedRepositories
};
