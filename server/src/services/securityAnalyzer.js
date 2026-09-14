/**
 * Static Security Analyzer
 * Evaluates repository configuration, committed files, and security patterns.
 */

class SecurityAnalyzer {
  /**
   * Analyze repository files for security risks
   * @param {Array<{path: string, content?: string}>} files
   */
  analyze(files = []) {
    const issues = [];
    let securityScore = 100;

    const filePaths = files.map((f) => f.path.toLowerCase());

    // 1. Check for committed .env files
    const committedEnv = files.find((f) => {
      const p = f.path.toLowerCase();
      return (p.endsWith('.env') || p.endsWith('.env.local') || p.endsWith('.env.production')) && !p.endsWith('.env.example');
    });

    if (committedEnv) {
      securityScore -= 30;
      issues.push({
        severity: 'CRITICAL',
        category: 'Secrets Exposure',
        issue: 'Committed environment file detected (.env)',
        recommendation: 'Remove .env from version control and add it to .gitignore immediately.'
      });
    }

    // 2. Check for .env.example template presence
    const hasEnvExample = filePaths.some((p) => p.endsWith('.env.example'));
    if (!hasEnvExample) {
      securityScore -= 10;
      issues.push({
        severity: 'LOW',
        category: 'Configuration',
        issue: 'Missing .env.example file',
        recommendation: 'Add a .env.example file to document required environment variables safely.'
      });
    }

    // 3. Check for hardcoded database credentials in files
    files.forEach((f) => {
      if (f.content) {
        if (/mongodb(\+srv)?:\/\/[^:\s]+:[^@\s]+@/i.test(f.content)) {
          securityScore -= 25;
          issues.push({
            severity: 'HIGH',
            category: 'Hardcoded Credentials',
            issue: `Hardcoded MongoDB connection URI in ${f.path}`,
            recommendation: 'Move connection string credentials to process.env environment variables.'
          });
        }
        if (/cors\s*\(\s*{\s*origin\s*:\s*['"]\*['"]/i.test(f.content)) {
          securityScore -= 15;
          issues.push({
            severity: 'MEDIUM',
            category: 'CORS Configuration',
            issue: `Unrestricted CORS wildcard (origin: '*') in ${f.path}`,
            recommendation: 'Restrict CORS allowed origins to trusted client domains.'
          });
        }
      }
    });

    securityScore = Math.max(0, Math.min(100, securityScore));

    return {
      score: securityScore,
      status: securityScore >= 80 ? 'Good' : securityScore >= 60 ? 'Warning' : 'Critical',
      issuesFound: issues.length,
      issues
    };
  }
}

module.exports = new SecurityAnalyzer();
