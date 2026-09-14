const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Extracts and verifies JWT from cookies or Authorization header.
 */
const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // Check cookie
    if (req.cookies && req.cookies.repobuddy_token) {
      token = req.cookies.repobuddy_token;
    }
    // Check Authorization header fallback
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication token required.' }
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    
    // Find user in DB (including hidden accessToken field for API calls)
    const user = await User.findById(decoded.userId).select('+githubAccessToken');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'Authenticated user no longer exists.' }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired session token.' }
    });
  }
};

/**
 * Optional Authentication Middleware
 * Attaches user to req if valid token is provided, but does not block unauthenticated requests.
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token = null;
    if (req.cookies && req.cookies.repobuddy_token) {
      token = req.cookies.repobuddy_token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await User.findById(decoded.userId).select('+githubAccessToken');
      if (user) {
        req.user = user;
      }
    }
  } catch (e) {
    // Ignore invalid tokens for optional auth
  }
  next();
};

module.exports = {
  requireAuth,
  optionalAuth
};
