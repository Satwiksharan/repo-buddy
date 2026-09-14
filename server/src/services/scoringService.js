/**
 * Repository Health Scoring Service
 * Computes a weighted Repository Health Score based on technical metrics.
 * NOTE: As per product specification, this is informational structural health
 * and must not be presented as an official industry metric.
 */

class ScoringService {
  /**
   * Calculate overall repository health score
   * @param {Object} metrics
   */
  calculateHealthScore(metrics = {}) {
    const architecture = metrics.architectureScore || 85;
    const codeQuality = metrics.codeQualityScore || 80;
    const security = metrics.securityScore || 85;
    const testing = metrics.testingScore || 40;
    const documentation = metrics.documentationScore || 80;
    const dependencies = metrics.dependenciesScore || 80;

    const overall = Math.round(
      architecture * 0.20 +
      codeQuality * 0.20 +
      security * 0.20 +
      testing * 0.15 +
      documentation * 0.15 +
      dependencies * 0.10
    );

    return {
      overall,
      architecture,
      codeQuality,
      security,
      testing,
      documentation,
      dependencies,
      disclaimer: 'Informational project structural health metric based on static analysis.'
    };
  }
}

module.exports = new ScoringService();
