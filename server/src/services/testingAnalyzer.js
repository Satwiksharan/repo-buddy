/**
 * Testing Analyzer
 * Evaluates repository test setup, test files, and test coverage indicators.
 */

class TestingAnalyzer {
  /**
   * Analyze testing configuration and files
   * @param {Array<{path: string}>} files
   * @param {Object} detectedTech
   */
  analyze(files = [], detectedTech = {}) {
    const filePaths = files.map((f) => f.path.toLowerCase());

    const hasTestDir = filePaths.some((p) => p.includes('test/') || p.includes('tests/') || p.includes('__tests__/'));
    const testFiles = filePaths.filter((p) => p.includes('.test.') || p.includes('.spec.'));

    const hasUnitTests = testFiles.length > 0 || hasTestDir;
    const hasIntegrationTests = filePaths.some((p) => p.includes('integration') || p.includes('api.test'));
    const hasE2ETests = filePaths.some((p) => p.includes('e2e') || p.includes('cypress') || p.includes('playwright'));

    const frameworks = detectedTech.testing || [];

    let testScore = 0;
    if (frameworks.length > 0) testScore += 30;
    if (hasTestDir) testScore += 25;
    if (testFiles.length > 0) testScore += 30;
    if (hasIntegrationTests || hasE2ETests) testScore += 15;

    testScore = Math.min(100, testScore);

    return {
      score: testScore,
      frameworks,
      testFileCount: testFiles.length,
      matrix: {
        unitTests: hasUnitTests ? 'Detected' : 'Not Detected',
        integrationTests: hasIntegrationTests ? 'Detected' : 'Not Detected',
        e2eTests: hasE2ETests ? 'Detected' : 'Not Detected'
      },
      summary: hasUnitTests
        ? `Detected ${testFiles.length} test files utilizing ${frameworks.join(', ') || 'test runner'}.`
        : 'No test suite or test files detected in repository.'
    };
  }
}

module.exports = new TestingAnalyzer();
