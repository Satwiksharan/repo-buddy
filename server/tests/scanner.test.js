const technologyDetector = require('../src/services/technologyDetector');
const architectureAnalyzer = require('../src/services/architectureAnalyzer');
const repositoryScanner = require('../src/services/repositoryScanner');
const request = require('supertest');
const app = require('../src/app');

describe('Phase 3: Technology Detector & Architecture Analysis Engine', () => {
  it('should deterministically detect MERN stack from package.json without AI', () => {
    const files = [
      {
        path: 'package.json',
        content: JSON.stringify({
          dependencies: {
            express: '^4.19.2',
            mongoose: '^8.3.1',
            jsonwebtoken: '^9.0.2',
            react: '^18.2.0',
            tailwindcss: '^3.4.3'
          },
          devDependencies: {
            jest: '^29.7.0',
            vite: '^5.2.8'
          }
        })
      },
      { path: 'Dockerfile', content: 'FROM node:18' }
    ];

    const tech = technologyDetector.detectTechnologies(files);

    expect(tech.frontend).toContain('React');
    expect(tech.frontend).toContain('Tailwind CSS');
    expect(tech.backend).toContain('Express.js');
    expect(tech.backend).toContain('Node.js');
    expect(tech.database).toContain('MongoDB');
    expect(tech.database).toContain('Mongoose');
    expect(tech.authentication).toContain('JWT');
    expect(tech.testing).toContain('Jest');
    expect(tech.deployment).toContain('Docker');
  });

  it('should infer Client-Server and Service Layer patterns correctly from file paths', () => {
    const filePaths = [
      'server/src/controllers/authController.js',
      'server/src/services/githubService.js',
      'server/src/models/User.js',
      'client/src/components/Navbar/Navbar.tsx',
      'client/src/pages/Dashboard.tsx'
    ];

    const arch = architectureAnalyzer.analyze(filePaths);

    expect(arch.primaryPattern).toBe('Client-Server');
    expect(arch.structure.controllers).toBe(true);
    expect(arch.structure.services).toBe(true);
    expect(arch.structure.models).toBe(true);
    expect(arch.structure.components).toBe(true);
  });

  it('should redact secrets correctly from strings', () => {
    const rawContent = 'const mongoUri = "mongodb+srv://admin:secretPass123@cluster.mongodb.net/prod";';
    const redacted = repositoryScanner.redactSecrets(rawContent);

    expect(redacted).not.toContain('secretPass123');
    expect(redacted).toContain('[REDACTED_DB_CREDENTIALS]');
  });

  it('POST /api/repositories/:id/scan should trigger scanner and return analysis payload', async () => {
    const res = await request(app).post('/api/repositories/101/scan');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('healthScore');
    expect(res.body.data).toHaveProperty('architecture');
    expect(res.body.data).toHaveProperty('technologies');
  });
});
