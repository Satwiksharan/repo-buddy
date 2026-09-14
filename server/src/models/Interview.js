const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  repositoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository',
    required: true
  },
  questions: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    questionText: String,
    category: String,
    difficulty: String,
    expectedConcepts: [String],
    sourceFiles: [String]
  }],
  answers: [{
    questionIndex: Number,
    answerText: String,
    submittedAt: { type: Date, default: Date.now }
  }],
  evaluations: [{
    questionIndex: Number,
    scores: {
      accuracy: Number,
      completeness: Number,
      depth: Number,
      clarity: Number,
      overall: Number
    },
    strengths: [String],
    missingConcepts: [String],
    feedback: String,
    followUpQuestion: String
  }],
  scores: {
    overall: { type: Number, default: 0 },
    projectExplanation: { type: Number, default: 0 },
    architecture: { type: Number, default: 0 },
    technologyChoices: { type: Number, default: 0 },
    database: { type: Number, default: 0 },
    authentication: { type: Number, default: 0 },
    security: { type: Number, default: 0 },
    scalability: { type: Number, default: 0 },
    testing: { type: Number, default: 0 }
  },
  weaknesses: [{
    category: String,
    severity: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'] },
    reason: String
  }],
  preparationPlan: [{
    topic: String,
    priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'] },
    reason: String,
    actionItems: [String]
  }],
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'COMPLETED'],
    default: 'IN_PROGRESS'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Interview', InterviewSchema);
