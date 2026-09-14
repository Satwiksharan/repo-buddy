const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  githubAccessToken: {
    type: String,
    default: '',
    select: false // Never return GitHub token in standard User queries
  },
  targetRole: {
    type: String,
    default: 'Software Engineer'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
