import { rateLimit } from 'express-rate-limit';

// Development-friendly rate limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 500, // Very generous limit for development
  message: {
    error: 'Too many requests',
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting in development and for GitHub Pages
  skip: (req) => {
    // Skip if in development OR using static data (GitHub Pages)
    return process.env.NODE_ENV !== 'production' || !process.env.DATABASE_URL;
  },
  // Handler for when limit is reached
  handler: (req, res) => {
    console.warn(`Rate limit exceeded for IP: ${req.ip}, path: ${req.path}`);
    res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: 'Too many requests. Please wait before making more requests.',
      retryAfter: 60
    });
  },
});

// Note: express-rate-limit automatically adds X-RateLimit headers
// No additional middleware needed