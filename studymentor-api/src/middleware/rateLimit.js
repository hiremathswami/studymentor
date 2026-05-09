/**
 * @file src/middleware/rateLimit.js
 * @description In-memory rate limiter per IP.
 *              Default: 60 req/min. Chatbot: 30/hour.
 *              Returns 429 with Retry-After header when exceeded.
 */

const rateLimits = new Map();

// Cleanup stale entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimits) {
    if (now > entry.resetAt) rateLimits.delete(ip);
  }
}, 10 * 60 * 1000);

/**
 * @param {number} limit  Max requests in window (default 60)
 * @param {number} windowMs Window duration in ms (default 60 000 = 1 min)
 */
function rateLimit(limit = 60, windowMs = 60 * 1000) {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const key = `${ip}:${req.baseUrl}`;
    const now = Date.now();

    if (!rateLimits.has(key)) {
      rateLimits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    const entry = rateLimits.get(key);

    if (now > entry.resetAt) {
      rateLimits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    entry.count++;

    if (entry.count > limit) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.set('Retry-After', String(retryAfter));
      return res.status(429).json({
        error: 'Too many requests, please try again later',
        retry_after_seconds: retryAfter
      });
    }

    next();
  };
}

module.exports = rateLimit;
