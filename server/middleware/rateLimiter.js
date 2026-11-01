/**
 * =================================================================================================
 * OVERTURN SECURITY MIDDLEWARE — RATE LIMITER & BRUTE-FORCE SHIELD (middleware/rateLimiter.js)
 * =================================================================================================
 * High-performance, zero-dependency sliding window rate limiter.
 * Protects against:
 * - Credential stuffing and brute-force password guessing on auth endpoints
 * - Denial-of-Service (DoS) and API endpoint flooding
 * =================================================================================================
 */

/**
 * Creates an in-memory sliding window rate limiter middleware
 *
 * @param {Object} options
 * @param {number} options.windowMs - Window duration in milliseconds (default 15 minutes)
 * @param {number} options.max - Maximum requests allowed per window (default 100)
 * @param {string} options.message - Error message to return when rate limit exceeded
 * @returns {express.RequestHandler}
 */
function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000;
  const max = options.max || 100;
  const message = options.message || 'Too many requests from this IP, please try again later.';
  
  // Map of IP -> Array of request timestamps
  const hits = new Map();

  // Periodic cleanup of stale IP records every 5 minutes to prevent memory leak
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of hits.entries()) {
      const active = timestamps.filter((t) => now - t < windowMs);
      if (active.length === 0) {
        hits.delete(ip);
      } else {
        hits.set(ip, active);
      }
    }
  }, Math.min(windowMs, 5 * 60 * 1000));

  // Allow Node process to exit cleanly without keeping event loop alive
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return function rateLimiter(req, res, next) {
    // Disable in test environment to avoid interfering with automated test harnesses
    if (process.env.NODE_ENV === 'test' || process.env.DISABLE_RATE_LIMIT === 'true') {
      return next();
    }

    let ip = req.ip;
    if (!ip && req.headers && req.headers['x-forwarded-for']) {
      const forwarded = req.headers['x-forwarded-for'];
      ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim();
    }
    if (!ip) {
      ip = req.socket?.remoteAddress || '127.0.0.1';
    }
    const now = Date.now();

    const timestamps = hits.get(ip) || [];
    // Keep only timestamps within current window
    const recent = timestamps.filter((t) => now - t < windowMs);

    if (recent.length >= max) {
      const oldest = recent[0];
      const resetTime = Math.ceil((oldest + windowMs - now) / 1000);
      
      res.setHeader('Retry-After', resetTime > 0 ? resetTime : 1);
      res.setHeader('RateLimit-Limit', max);
      res.setHeader('RateLimit-Remaining', 0);
      res.setHeader('RateLimit-Reset', resetTime);

      return res.status(429).json({
        success: false,
        error: message,
        retryAfterSeconds: resetTime > 0 ? resetTime : 1,
      });
    }

    recent.push(now);
    hits.set(ip, recent);

    res.setHeader('RateLimit-Limit', max);
    res.setHeader('RateLimit-Remaining', Math.max(0, max - recent.length));

    next();
  };
}

// Strict limiter for authentication endpoints: 15 attempts per 15 minutes
const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: 'Too many authentication attempts from this IP address. Please wait 15 minutes before retrying.',
});

// General API limiter: 120 requests per minute
const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 120,
  message: 'Too many requests dispatched to Overturn API. Please throttle your client requests.',
});

module.exports = {
  createRateLimiter,
  authRateLimiter,
  apiRateLimiter,
};
