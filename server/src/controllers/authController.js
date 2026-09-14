const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const githubService = require('../services/githubService');

/**
 * Redirect to GitHub OAuth Authorization URL
 */
const initiateGithubLogin = (req, res) => {
  if (!config.github.clientId) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'MISSING_GITHUB_CONFIG',
        message: 'GitHub OAuth Client ID is not configured on the server.'
      }
    });
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&redirect_uri=${encodeURIComponent(config.github.callbackUrl)}&scope=read:user repo user:email`;

  return res.redirect(githubAuthUrl);
};

/**
 * Handle OAuth Callback from GitHub
 */
const handleGithubCallback = async (req, res, next) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_CODE', message: 'Authorization code is missing from GitHub callback.' }
    });
  }

  try {
    const accessToken = await githubService.exchangeCodeForToken(code);
    const profile = await githubService.fetchGithubUserProfile(accessToken);

    // Upsert User record
    let user = await User.findOne({ githubId: profile.githubId });

    if (user) {
      user.username = profile.username;
      user.name = profile.name;
      user.email = profile.email;
      user.avatarUrl = profile.avatarUrl;
      user.githubAccessToken = accessToken;
      await user.save();
    } else {
      user = await User.create({
        githubId: profile.githubId,
        username: profile.username,
        name: profile.name,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
        githubAccessToken: accessToken
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, githubId: user.githubId, username: user.username },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Set secure HTTP-only cookie
    res.cookie('repobuddy_token', token, {
      httpOnly: true,
      secure: config.nodeEnv === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect user to frontend dashboard
    return res.redirect(`${config.clientUrl}/dashboard?login=success`);
  } catch (error) {
    console.error('[AuthController Callback Error]:', error.message);
    return res.redirect(`${config.clientUrl}/login?error=auth_failed`);
  }
};

/**
 * Get Currently Authenticated User Profile
 */
const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Not authenticated.' }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        githubId: req.user.githubId,
        username: req.user.username,
        name: req.user.name,
        email: req.user.email,
        avatarUrl: req.user.avatarUrl,
        targetRole: req.user.targetRole
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: error.message }
    });
  }
};

/**
 * Logout User (Clear Auth Cookie)
 */
const logout = (req, res) => {
  res.clearCookie('repobuddy_token');
  return res.status(200).json({
    success: true,
    message: 'Successfully logged out.'
  });
};

module.exports = {
  initiateGithubLogin,
  handleGithubCallback,
  getCurrentUser,
  logout
};
