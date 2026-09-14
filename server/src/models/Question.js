const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  repositoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository',
    required: true
  },
  category: {
    type: String,
    enum: [
      'Project Overview',
      'Architecture',
      'Technology Choices',
      'Frontend',
      'Backend',
      'Database',
      'Authentication',
      'API Design',
      'Security',
      'Performance',
      'Scalability',
      'Testing',
      'Deployment'
    ],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  question: {
    type: String,
    required: true
  },
  expectedConcepts: [String],
  sourceFiles: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', QuestionSchema);
