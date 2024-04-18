const rateLimit = require('express-rate-limit');

// Rate limiting middleware configuration
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100, // Max requests per window
    message: 'Too many requests, please try again later.',
});

module.exports = limiter;
