const request = require('supertest');
const app = require('../src/app');

describe('Phase 10: Progress Analytics & Retake History', () => {
  it('GET /api/progress should return overall score history and category growth metrics', async () => {
    const res = await request(app).get('/api/progress');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('currentReadinessScore');
    expect(res.body.data).toHaveProperty('history');
    expect(res.body.data.history.length).toBeGreaterThan(0);
    expect(res.body.data).toHaveProperty('categoryGrowth');
  });

  it('GET /api/repositories/:id/progress should return repository progress metrics', async () => {
    const res = await request(app).get('/api/repositories/101/progress');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.repositoryId).toBe('101');
    expect(res.body.data).toHaveProperty('history');
  });
});
