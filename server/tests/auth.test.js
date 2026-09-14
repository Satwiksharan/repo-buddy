const request = require('supertest');
const app = require('../src/app');

describe('Auth Endpoints', () => {
  it('GET /api/auth/github should initiate OAuth redirect', async () => {
    const res = await request(app).get('/api/auth/github');
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toContain('https://github.com/login/oauth/authorize');
  });

  it('GET /api/auth/me should return 401 UNAUTHORIZED when unauthenticated', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('POST /api/auth/logout should clear cookie and return 200 OK', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
