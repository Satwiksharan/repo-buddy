const request = require('supertest');
const app = require('../src/app');
const explanationFallback = require('../src/services/explanationFallback');

describe('Phase 6: Project Explanation Engine', () => {
  jest.setTimeout(20000);

  it('should generate grounded fallback explanation pitch data', () => {
    const projectContext = {
      project: { name: 'TestRepo' },
      technologies: {
        frontend: ['React'],
        backend: ['Express.js'],
        database: ['MongoDB'],
        authentication: ['JWT']
      },
      architecture: { primaryPattern: 'Client-Server' }
    };

    const fallback = explanationFallback.generateFallback(projectContext);

    expect(fallback.summary30s).toContain('TestRepo');
    expect(fallback.summary30s).toContain('React');
    expect(fallback.summary1m).toContain('Express.js');
    expect(fallback.summary3m).toContain('MongoDB');
    expect(fallback.techDecisions.length).toBeGreaterThan(0);
  });

  it('GET /api/repositories/:id/explanation should return 200 OK with explanation pitches', async () => {
    const res = await request(app).get('/api/repositories/101/explanation');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('summary30s');
    expect(res.body.data).toHaveProperty('summary1m');
    expect(res.body.data).toHaveProperty('summary3m');
  });
});
