const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 5001}`;

const config = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  serverUrl,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/repobuddy',
  jwtSecret: process.env.JWT_SECRET || process.env.SESSION_SECRET || 'repobuddy_dev_jwt_secret_key_12345',
  
  // GitHub OAuth
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackUrl: process.env.GITHUB_CALLBACK_URL || `${serverUrl}/api/auth/github/callback`
  },
  
  // AI Config
  ai: {
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'gemini-2.5-flash',
    baseUrl: process.env.AI_BASE_URL || 'https://generativelanguage.googleapis.com'
  }
};

module.exports = config;
