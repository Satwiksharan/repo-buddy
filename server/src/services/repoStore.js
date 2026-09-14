const repositoryScanner = require('./repositoryScanner');

class RepoStore {
  constructor() {
    this.repos = new Map();
    this.scans = new Map();
  }

  saveRepo(repoData) {
    const id = String(repoData.githubId || repoData.fullName || Date.now());
    const item = {
      githubId: id,
      name: repoData.name || id,
      fullName: repoData.fullName || `imported/${repoData.name || id}`,
      description: repoData.description || 'GitHub Repository',
      url: repoData.url || `https://github.com/${repoData.fullName || id}`,
      defaultBranch: repoData.defaultBranch || 'main',
      language: repoData.language || 'JavaScript',
      isPrivate: !!repoData.isPrivate,
      stars: repoData.stars || 0,
      forks: repoData.forks || 0,
      updatedAt: repoData.updatedAt || new Date().toISOString()
    };

    this.repos.set(id, item);
    this.repos.set(item.fullName.toLowerCase(), item);
    this.repos.set(item.name.toLowerCase(), item);
    return item;
  }

  getRepo(id) {
    if (!id) {
      const all = this.listRepos();
      return all[0] || null;
    }
    const key = String(id).toLowerCase();

    if (this.repos.has(key)) {
      return this.repos.get(key);
    }

    if (key.includes('/')) {
      const parts = key.split('/');
      return this.saveRepo({
        githubId: key,
        name: parts[1],
        fullName: key,
        description: `GitHub repository ${key}`,
        url: `https://github.com/${key}`
      });
    }

    const all = this.listRepos();
    return all[0] || this.saveRepo({
      githubId: id,
      name: id,
      fullName: id,
      description: `GitHub repository ${id}`,
      url: `https://github.com/${id}`
    });
  }

  async getOrScanRepo(id, accessToken = null) {
    const repo = this.getRepo(id);
    const cacheKey = repo.githubId || repo.fullName;

    if (this.scans.has(cacheKey)) {
      return { repo, scanResult: this.scans.get(cacheKey) };
    }

    const scanResult = await repositoryScanner.scanRepository(repo.fullName, accessToken, repo.name);
    this.scans.set(cacheKey, scanResult);
    return { repo, scanResult };
  }

  listRepos() {
    const unique = new Map();
    for (const repo of this.repos.values()) {
      unique.set(repo.githubId, repo);
    }
    return Array.from(unique.values());
  }
}

module.exports = new RepoStore();
