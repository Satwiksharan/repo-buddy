const mongoose = require('mongoose');

const ScanSchema = new mongoose.Schema({
  repositoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository',
    required: true
  },
  healthScore: {
    overall: { type: Number, default: 0 },
    architecture: { type: Number, default: 0 },
    codeQuality: { type: Number, default: 0 },
    security: { type: Number, default: 0 },
    testing: { type: Number, default: 0 },
    documentation: { type: Number, default: 0 },
    dependencies: { type: Number, default: 0 }
  },
  architecture: {
    pattern: { type: String, default: 'Client-Server' },
    components: [mongoose.Schema.Types.Mixed],
    diagram: { type: String, default: '' }
  },
  technologies: mongoose.Schema.Types.Mixed,
  securityIssues: [mongoose.Schema.Types.Mixed],
  qualityIssues: [mongoose.Schema.Types.Mixed],
  testing: mongoose.Schema.Types.Mixed,
  documentation: mongoose.Schema.Types.Mixed,
  importantFiles: [String],
  projectContext: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

module.exports = mongoose.model('Scan', ScanSchema);
