const axios = require('axios');
const config = require('../config/env');

class GithubService {
  /**
   * Exchange OAuth Authorization Code for an Access Token
   */
  async exchangeCodeForToken(code) {
    try {
      const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: config.github.clientId,
          client_secret: config.github.clientSecret,
          code,
          redirect_uri: config.github.callbackUrl
        },
        {
          headers: {
            Accept: 'application/json'
          }
        }
      );

      if (response.data.error) {
        throw new Error(`GitHub OAuth Error: ${response.data.error_description || response.data.error}`);
      }

      return response.data.access_token;
    } catch (error) {
      console.error('[GithubService] Error exchanging code for token:', error.message);
      throw error;
    }
  }

  /**
   * Fetch authenticated GitHub user profile
   */
  async fetchGithubUserProfile(accessToken) {
    try {
      const response = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${accessToken}`,
          'User-Agent': 'RepoBuddy-App'
        }
      });

      const user = response.data;
      
      // Fetch primary email if null in primary profile
      let email = user.email || '';
      if (!email) {
        try {
          const emailsRes = await axios.get('https://api.github.com/user/emails', {
            headers: {
              Authorization: `token ${accessToken}`,
              'User-Agent': 'RepoBuddy-App'
            }
          });
          const primaryEmailObj = emailsRes.data.find((e) => e.primary) || emailsRes.data[0];
          if (primaryEmailObj) email = primaryEmailObj.email;
        } catch (e) {
          console.warn('[GithubService] Could not fetch private emails:', e.message);
        }
      }

      return {
        githubId: String(user.id),
        username: user.login,
        name: user.name || user.login,
        email,
        avatarUrl: user.avatar_url
      };
    } catch (error) {
      console.error('[GithubService] Error fetching user profile:', error.message);
      throw error;
    }
  }

  /**
   * Fetch authenticated user repositories from GitHub REST API
   */
  async fetchUserRepositories(accessToken) {
    try {
      const response = await axios.get('https://api.github.com/user/repos', {
        params: {
          sort: 'updated',
          direction: 'desc',
          per_page: 100,
          affiliation: 'owner,collaborator'
        },
        headers: {
          Authorization: `token ${accessToken}`,
          'User-Agent': 'RepoBuddy-App'
        }
      });

      return response.data.map((repo) => ({
        githubId: String(repo.id),
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || 'No description provided.',
        url: repo.html_url,
        defaultBranch: repo.default_branch || 'main',
        language: repo.language || 'Plain Text',
        isPrivate: repo.private,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        updatedAt: repo.updated_at
      }));
    } catch (error) {
      if (error.response && error.response.status === 403 && error.response.headers['x-ratelimit-remaining'] === '0') {
        throw new Error('GitHub API rate limit exceeded. Please try again in a few minutes.');
      }
      console.error('[GithubService] Error fetching user repositories:', error.message);
      throw error;
    }
  }
  /**
   * Fetch details for any public GitHub repository (e.g. owner/repo)
   */
  async fetchPublicRepositoryDetails(owner, repo, token = null) {
    try {
      const headers = { 'User-Agent': 'RepoBuddy-App' };
      if (token) headers.Authorization = `token ${token}`;

      const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, { headers });
      const r = response.data;
      return {
        githubId: String(r.id),
        name: r.name,
        fullName: r.full_name,
        description: r.description || 'No description provided.',
        url: r.html_url,
        defaultBranch: r.default_branch || 'main',
        language: r.language || 'JavaScript',
        isPrivate: r.private,
        stars: r.stargazers_count || 0,
        forks: r.forks_count || 0,
        updatedAt: r.updated_at
      };
    } catch (error) {
      console.error(`[GithubService] Error fetching public repository ${owner}/${repo}:`, error.message);
      throw new Error(`Could not fetch repository ${owner}/${repo} from GitHub. Verify repo name and visibility.`);
    }
  }

  /**
   * Fetch public repositories by GitHub username
   */
  async fetchPublicUserRepositories(username, token = null) {
    try {
      const headers = { 'User-Agent': 'RepoBuddy-App' };
      if (token) headers.Authorization = `token ${token}`;

      const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
        params: { sort: 'updated', direction: 'desc', per_page: 100 },
        headers
      });

      return response.data.map((repo) => ({
        githubId: String(repo.id),
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || 'No description provided.',
        url: repo.html_url,
        defaultBranch: repo.default_branch || 'main',
        language: repo.language || 'Plain Text',
        isPrivate: repo.private,
        stars: repo.stargazers_count || 0,
        forks: repo.forks_count || 0,
        updatedAt: repo.updated_at
      }));
    } catch (error) {
      console.error(`[GithubService] Error fetching public user repos for ${username}:`, error.message);
      throw new Error(`Could not fetch repositories for user '${username}' from GitHub.`);
    }
  }

  /**
   * Fetch recursive Git tree structure for a repository
   */
  async fetchRepositoryTree(owner, repo, branch = 'main', token = null) {
    const headers = { 'User-Agent': 'RepoBuddy-App' };
    if (token) headers.Authorization = `token ${token}`;

    const branchesToTry = [branch, 'main', 'master'];
    for (const b of branchesToTry) {
      try {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/git/trees/${b}?recursive=1`, { headers });
        if (response.data && Array.isArray(response.data.tree)) {
          return response.data.tree;
        }
      } catch (e) {
        // try next branch
      }
    }
    return [];
  }

  /**
   * Fetch file raw text content from GitHub
   */
  async fetchFileContent(owner, repo, filePath, token = null) {
    try {
      const headers = {
        'User-Agent': 'RepoBuddy-App',
        Accept: 'application/vnd.github.v3.raw'
      };
      if (token) headers.Authorization = `token ${token}`;

      const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, { headers });
      return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new GithubService();
