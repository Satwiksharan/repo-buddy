/**
 * Rate Limiting Middleware
 * Protects API endpoints against excessive requests and brute-force attacks.
 */

const requestCounts = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const MAX_REQUESTS = 100; // Max 100 requests per window per IP

const rateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
  const now = Date.now();

  let record = requestCounts.get(ip);
  if (!record || now - record.startTime > WINDOW_MS) {
    record = { startTime: now, count: 1 };
    requestCounts.set(ip, record);
    return next();
  }

  record.count += 1;
  if (record.count > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded. Please wait a few minutes before trying again.'
      }
    });
  }

  next();
};

module.exports = rateLimiter;
