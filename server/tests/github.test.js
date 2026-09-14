const request = require('supertest');
const app = require('../src/app');

describe('GitHub Endpoints', () => {
  it('GET /api/github/repositories should require authentication', async () => {
    const res = await request(app).get('/api/github/repositories');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
