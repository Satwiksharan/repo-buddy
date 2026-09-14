const request = require('supertest');
const app = require('../src/app');
const aiService = require('../src/ai/aiService');

describe('Phase 7: Explanation Practice & AI Evaluation Engine', () => {
  jest.setTimeout(20000);

  it('POST /api/repositories/:id/explanation/evaluate should return 400 when answer is empty', async () => {
    const res = await request(app)
      .post('/api/repositories/101/explanation/evaluate')
      .send({ answer: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('INVALID_INPUT');
  });

  it('POST /api/repositories/:id/explanation/evaluate should evaluate answer against 5 criteria and return feedback', async () => {
    const candidateAnswer = "I built CampusConnect to solve student event discovery using React, Node.js, Express, and MongoDB. Data is authenticated via JWT tokens.";

    const res = await request(app)
      .post('/api/repositories/101/explanation/evaluate')
      .send({ answer: candidateAnswer });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('scores');
    expect(res.body.data.scores).toHaveProperty('overall');
    expect(res.body.data).toHaveProperty('strengths');
    expect(res.body.data).toHaveProperty('missingConcepts');
    expect(res.body.data).toHaveProperty('feedback');
    expect(res.body.data).toHaveProperty('followUpQuestion');
  });
});
