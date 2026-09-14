/**
 * Architecture Analyzer
 * Analyzes repository structure, file locations, and architectural patterns.
 */

class ArchitectureAnalyzer {
  /**
   * Analyze architecture from list of file paths
   * @param {Array<string>} filePaths
   */
  analyze(filePaths = []) {
    const structure = {
      controllers: filePaths.some((p) => p.includes('controllers/')),
      routes: filePaths.some((p) => p.includes('routes/') || p.includes('api/')),
      services: filePaths.some((p) => p.includes('services/')),
      models: filePaths.some((p) => p.includes('models/') || p.includes('schemas/')),
      middleware: filePaths.some((p) => p.includes('middleware/')),
      components: filePaths.some((p) => p.includes('components/')),
      pages: filePaths.some((p) => p.includes('pages/') || p.includes('views/')),
      hooks: filePaths.some((p) => p.includes('hooks/')),
      utils: filePaths.some((p) => p.includes('utils/') || p.includes('helpers/'))
    };

    const hasFrontend = structure.components || structure.pages;
    const hasBackend = structure.controllers || structure.routes || structure.services;

    let primaryPattern = 'Monolithic';
    const detectedPatterns = [];

    if (hasFrontend && hasBackend) {
      primaryPattern = 'Client-Server';
      detectedPatterns.push({ pattern: 'Client-Server Architecture', status: 'Detected', confidence: 'High' });
    }

    if (structure.controllers && (structure.pages || structure.views) && structure.models) {
      detectedPatterns.push({ pattern: 'MVC (Model-View-Controller)', status: 'Detected', confidence: 'High' });
    } else if (structure.controllers && structure.models) {
      detectedPatterns.push({ pattern: 'MVC (API-only)', status: 'Likely', confidence: 'Medium' });
    }

    if (structure.services) {
      detectedPatterns.push({ pattern: 'Service Layer Pattern', status: 'Detected', confidence: 'High' });
    } else {
      detectedPatterns.push({ pattern: 'Service Layer Pattern', status: 'Not detected', confidence: 'Low' });
    }

    if (structure.components) {
      detectedPatterns.push({ pattern: 'Component-Based UI Architecture', status: 'Detected', confidence: 'High' });
    }

    if (structure.middleware) {
      detectedPatterns.push({ pattern: 'Middleware Pipeline Pattern', status: 'Detected', confidence: 'High' });
    }

    return {
      primaryPattern,
      structure,
      patterns: detectedPatterns,
      summary: `Analyzed ${filePaths.length} files. Structure indicates a ${primaryPattern} layout.`
    };
  }
}

module.exports = new ArchitectureAnalyzer();
