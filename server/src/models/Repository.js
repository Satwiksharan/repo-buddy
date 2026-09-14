const mongoose = require('mongoose');

const RepositorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  githubId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    required: true
  },
  defaultBranch: {
    type: String,
    default: 'main'
  },
  language: {
    type: String,
    default: ''
  },
  technologies: {
    frontend: [String],
    backend: [String],
    database: [String],
    authentication: [String],
    testing: [String],
    deployment: [String]
  },
  lastScanned: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Repository', RepositorySchema);
