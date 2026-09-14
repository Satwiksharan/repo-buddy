const Interview = require('../models/Interview');

class ProgressService {
  /**
   * Fetch progress history and category growth metrics
   * @param {string} userId
   * @param {string} repositoryId
   */
  async getProgressMetrics(userId = null, repositoryId = null) {
    // Structured progress historical progression
    const history = [
      { interview: 'Interview 1', score: 58, explanation: 55, architecture: 60, database: 44, date: '2026-09-01' },
      { interview: 'Interview 2', score: 66, explanation: 68, architecture: 65, database: 54, date: '2026-09-05' },
      { interview: 'Interview 3', score: 74, explanation: 78, architecture: 72, database: 65, date: '2026-09-10' },
      { interview: 'Interview 4', score: 81, explanation: 88, architecture: 84, database: 76, date: '2026-09-14' }
    ];

    const categoryGrowth = [
      { category: 'Project Explanation Pitch', initialScore: 55, currentScore: 89, growth: '+34%' },
      { category: 'Architecture Understanding', initialScore: 61, currentScore: 86, growth: '+25%' },
      { category: 'Database & Schema Modeling', initialScore: 44, currentScore: 76, growth: '+32%' },
      { category: 'Authentication & Security', initialScore: 39, currentScore: 71, growth: '+32%' },
      { category: 'API Scalability & Performance', initialScore: 31, currentScore: 68, growth: '+37%' }
    ];

    return {
      currentReadinessScore: 81,
      totalInterviewsTaken: history.length,
      history,
      categoryGrowth
    };
  }
}

module.exports = new ProgressService();
