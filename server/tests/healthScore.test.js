const securityAnalyzer = require('../src/services/securityAnalyzer');
const testingAnalyzer = require('../src/services/testingAnalyzer');
const documentationAnalyzer = require('../src/services/documentationAnalyzer');
const scoringService = require('../src/services/scoringService');

describe('Phase 4: Health Analysis (Security, Testing, Documentation & Scoring)', () => {
  it('should detect committed .env file as a critical security issue', () => {
    const files = [
      { path: '.env', content: 'SECRET_KEY=my_super_secret_12345' },
      { path: 'server/src/server.js', content: 'console.log("server running");' }
    ];

    const result = securityAnalyzer.analyze(files);
    expect(result.score).toBeLessThan(80);
    expect(result.issuesFound).toBeGreaterThan(0);
    expect(result.issues[0].severity).toBe('CRITICAL');
  });

  it('should analyze test file presence and return testing matrix', () => {
    const files = [
      { path: 'server/tests/auth.test.js' },
      { path: 'client/src/App.test.tsx' }
    ];
    const tech = { testing: ['Jest'] };

    const result = testingAnalyzer.analyze(files, tech);
    expect(result.testFileCount).toBe(2);
    expect(result.matrix.unitTests).toBe('Detected');
  });

  it('should score README.md completeness based on key documentation sections', () => {
    const readme = `# Project Title\n## Description\nA great app.\n## Features\n- Auth\n## Installation\nnpm install\n## Tech Stack\nReact, Express`;
    const result = documentationAnalyzer.analyze(readme);

    expect(result.hasReadme).toBe(true);
    expect(result.score).toBeGreaterThan(50);
  });

  it('should calculate weighted Repository Health Score correctly', () => {
    const health = scoringService.calculateHealthScore({
      architectureScore: 90,
      codeQualityScore: 80,
      securityScore: 100,
      testingScore: 60,
      documentationScore: 80,
      dependenciesScore: 80
    });

    expect(health.overall).toBeGreaterThanOrEqual(80);
    expect(health).toHaveProperty('disclaimer');
  });
});
