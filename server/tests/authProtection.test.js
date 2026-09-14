const request = require('supertest');
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const config = require('../src/config/env');
const User = require('../src/models/User');

describe('Phase 5: Auth Middleware & Route Security Protection', () => {
  it('GET /api/github/repositories should return 401 UNAUTHORIZED without token', async () => {
    const res = await request(app).get('/api/github/repositories');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/repositories should return 401 UNAUTHORIZED without token', async () => {
    const res = await request(app).get('/api/repositories');
    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('GET /api/auth/me should return user details when provided with a valid Bearer token', async () => {
    // Create dummy user ID and sign JWT
    const dummyUserId = '65f1a2b3c4d5e6f7a8b9c0d1';
    const token = jwt.sign({ userId: dummyUserId, username: 'testuser' }, config.jwtSecret, { expiresIn: '1h' });

    // Mock User.findById
    jest.spyOn(User, 'findById').mockReturnValue({
      select: jest.fn().mockResolvedValue({
        _id: dummyUserId,
        githubId: '99999',
        username: 'testuser',
        name: 'Test Candidate',
        email: 'test@example.com',
        avatarUrl: 'https://github.com/testuser.png',
        targetRole: 'Software Engineer'
      })
    });

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.username).toBe('testuser');

    User.findById.mockRestore();
  });
});
