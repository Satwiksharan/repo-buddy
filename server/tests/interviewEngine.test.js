const request = require('supertest');
const app = require('../src/app');
const interviewService = require('../src/services/interviewService');

describe('Phase 8: AI Mock Technical Interview Engine', () => {
  jest.setTimeout(20000);

  it('GET /api/repositories/:id/questions should return project-grounded questions', async () => {
    const res = await request(app).get('/api/repositories/101/questions');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('sourceFiles');
    expect(res.body.data[0]).toHaveProperty('expectedConcepts');
  });

  it('POST /api/interviews should create a new mock interview session', async () => {
    const res = await request(app)
      .post('/api/interviews')
      .send({ repositoryId: '101' });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('questions');
  });

  it('POST /api/interviews/:id/answer should evaluate answer and return feedback', async () => {
    const res = await request(app)
      .post('/api/interviews/mock_interview_101/answer')
      .send({ questionIndex: 0, answer: 'Authentication uses JWT tokens verified in middleware.' });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('scores');
    expect(res.body.data).toHaveProperty('followUpQuestion');
  });

  it('POST /api/interviews/:id/finish should complete interview and return final score breakdown', async () => {
    const res = await request(app)
      .post('/api/interviews/mock_interview_101/finish');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('COMPLETED');
    expect(res.body.data).toHaveProperty('scores');
    expect(res.body.data).toHaveProperty('weaknesses');
    expect(res.body.data).toHaveProperty('preparationPlan');
  });
});
