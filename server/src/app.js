const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const config = require('./config/env');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const githubRoutes = require('./routes/githubRoutes');
const repositoryRoutes = require('./routes/repositoryRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const explanationRoutes = require('./routes/explanationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const progressRoutes = require('./routes/progressRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors({
  origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/repositories', repositoryRoutes);
app.use('/api/repositories', explanationRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api', interviewRoutes);
app.use('/api', progressRoutes);

const path = require('path');

// In production, serve frontend static build if present
if (config.nodeEnv === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) return next();
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  // Catch-all 404 route for undefined API endpoints in non-production
  app.use('*', (req, res, next) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint ${req.originalUrl} not found.`
      }
    });
  });
}

// Centralized error handling
app.use(errorHandler);

module.exports = app;
