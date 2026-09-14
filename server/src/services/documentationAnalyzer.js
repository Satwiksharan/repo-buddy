/**
 * Documentation Analyzer
 * Evaluates README.md completeness and project documentation quality.
 */

class DocumentationAnalyzer {
  /**
   * Analyze documentation completeness from README content
   * @param {string} readmeContent
   */
  analyze(readmeContent = '') {
    if (!readmeContent) {
      return {
        score: 30,
        hasReadme: false,
        sections: [],
        recommendations: ['Create a README.md file at the repository root to document setup and features.']
      };
    }

    const lower = readmeContent.toLowerCase();
    const sections = {
      description: lower.includes('description') || lower.includes('about') || lower.includes('overview') || lower.includes('title'),
      features: lower.includes('feature') || lower.includes('key features'),
      installation: lower.includes('install') || lower.includes('getting started') || lower.includes('setup'),
      environmentSetup: lower.includes('env') || lower.includes('environment'),
      usage: lower.includes('usage') || lower.includes('run') || lower.includes('start'),
      techStack: lower.includes('tech stack') || lower.includes('built with') || lower.includes('technologies'),
      apiDocs: lower.includes('api') || lower.includes('endpoints') || lower.includes('routes'),
      architecture: lower.includes('architecture') || lower.includes('folder structure') || lower.includes('directory'),
      screenshots: lower.includes('.png') || lower.includes('.jpg') || lower.includes('screenshot') || lower.includes('demo')
    };

    const totalChecklist = Object.keys(sections).length;
    const matchedCount = Object.values(sections).filter(Boolean).length;

    // Base score of 50 for having a README + up to 50 additional points for completeness
    const docScore = Math.round(50 + (matchedCount / totalChecklist) * 50);

    const recommendations = [];
    if (!sections.installation) recommendations.push('Add an Installation & Local Setup guide.');
    if (!sections.environmentSetup) recommendations.push('Document required Environment Variables (.env).');
    if (!sections.architecture) recommendations.push('Add an Architecture or Directory Structure section.');
    if (!sections.apiDocs) recommendations.push('Include API endpoint documentation.');

    return {
      score: docScore,
      hasReadme: true,
      sections,
      recommendations
    };
  }
}

module.exports = new DocumentationAnalyzer();
