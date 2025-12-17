const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,          // 15 minutes
  max: 100,                          // 100 requests per IP per window
  standardHeaders: true,             // RateLimit-* headers
  legacyHeaders: false,              // Disable X-RateLimit-* headers
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,               // 1 minute
  max: 10,                           // 10 chat calls per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Chat rate limit exceeded. Please wait a moment and try again.'
  }
});

module.exports = {
  globalLimiter,
  chatLimiter
};
