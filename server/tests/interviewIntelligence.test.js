const request = require('supertest');
const app = require('../src/app');
const interviewService = require('../src/services/interviewService');

describe('Phase 9: Interview Intelligence (Weakness Detection & Preparation Plan)', () => {
  it('should derive weaknesses and readiness scores from evaluation data', () => {
    const intel = interviewService.deriveInterviewIntelligence();

    expect(intel).toHaveProperty('scores');
    expect(intel.scores).toHaveProperty('overall');
    expect(intel.weaknesses.length).toBeGreaterThan(0);
    expect(intel.weaknesses[0]).toHaveProperty('severity');
    expect(intel.preparationPlan.length).toBeGreaterThan(0);
    expect(intel.preparationPlan[0]).toHaveProperty('priority');
  });

  it('GET /api/interviews/practice-weakness should return targeted practice questions for weak topic', async () => {
    const res = await request(app)
      .get('/api/interviews/practice-weakness?category=Database');

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.category).toBe('Database');
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});
