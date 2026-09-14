const githubService = require('../services/githubService');
const repoStore = require('../services/repoStore');

/**
 * Fetch GitHub Repositories for Authenticated User or Imported List
 */
const getUserRepositories = async (req, res) => {
  try {
    const accessToken = req.user?.githubAccessToken;

    if (!accessToken) {
      return res.status(200).json({
        success: true,
        isDemo: true,
        data: repoStore.listRepos()
      });
    }

    const repositories = await githubService.fetchUserRepositories(accessToken);
    repositories.forEach((repo) => repoStore.saveRepo(repo));

    return res.status(200).json({
      success: true,
      isDemo: false,
      count: repositories.length,
      data: repoStore.listRepos()
    });
  } catch (error) {
    console.error('[GithubController Error]:', error.message);
    return res.status(200).json({
      success: true,
      isDemo: true,
      data: repoStore.listRepos()
    });
  }
};

/**
 * Get Specific Repository Details
 */
const getRepositoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const repo = repoStore.getRepo(id);
    return res.status(200).json({
      success: true,
      data: repo
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

/**
 * Import Any Public GitHub Repository by URL or Username
 */
const importRepository = async (req, res) => {
  const { url, token } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_URL', message: 'Please provide a valid GitHub repository URL or username.' }
    });
  }

  try {
    const cleaned = url.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\/$/, '');

    // Case 1: Full owner/repo string
    if (cleaned.includes('/')) {
      const parts = cleaned.split('/');
      const owner = parts[0];
      const repo = parts[1];

      const details = await githubService.fetchPublicRepositoryDetails(owner, repo, token);
      const saved = repoStore.saveRepo(details);
      return res.status(200).json({
        success: true,
        data: saved
      });
    }

    // Case 2: Username string
    const userRepos = await githubService.fetchPublicUserRepositories(cleaned, token);
    const savedList = userRepos.map((r) => repoStore.saveRepo(r));
    return res.status(200).json({
      success: true,
      count: savedList.length,
      data: savedList
    });
  } catch (error) {
    console.error('[GithubController importRepository Error]:', error.message);
    return res.status(400).json({
      success: false,
      error: { code: 'IMPORT_FAILED', message: error.message || 'Failed to import repository from GitHub.' }
    });
  }
};

module.exports = {
  getUserRepositories,
  getRepositoryById,
  importRepository
};
