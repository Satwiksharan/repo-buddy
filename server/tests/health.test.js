const request = require('supertest');
const app = require('../src/app');

describe('GET /api/health', () => {
  it('should return 200 OK with RepoBuddy API status message', async () => {
    const res = await request(app).get('/api/health');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'RepoBuddy API is running');
  });

  it('should return 404 for invalid API routes', async () => {
    const res = await request(app).get('/api/nonexistent-route');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.error).toHaveProperty('code', 'NOT_FOUND');
  });
});
