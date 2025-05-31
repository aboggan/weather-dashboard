// server/src/middleware/rateLimiter.js

import rateLimit from 'express-rate-limit';

// Middleware to limit each IP to 10 requests per minute
const weatherRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // max 10 requests per IP per minute
  message: 'Too many requests, please try again later.'
});

export default weatherRateLimiter;
