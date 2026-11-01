/**
 * =================================================================================================
 * OVERTURN SECURITY MIDDLEWARE — HTTP SECURITY HEADERS (middleware/securityHeaders.js)
 * =================================================================================================
 * Implements hardened security headers equivalent to Helmet.js with zero third-party dependencies:
 * - Content-Security-Policy (CSP)
 * - Strict-Transport-Security (HSTS)
 * - X-Frame-Options (Clickjacking defense)
 * - X-Content-Type-Options (MIME-sniffing prevention)
 * - Referrer-Policy & Permissions-Policy
 * =================================================================================================
 */

function securityHeaders(req, res, next) {
  // 1. Prevent MIME-sniffing attacks
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // 2. Prevent clickjacking by forbidding embedding in iframes
  res.setHeader('X-Frame-Options', 'DENY');

  // 3. Enable legacy browser XSS filtering
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // 4. Enforce strict HTTPS in production
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }

  // 5. Restrict referrer leakage to third parties
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 6. Disable unneeded browser hardware capabilities
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // 7. Content Security Policy (allows Google Fonts and local Vite connections)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "img-src 'self' data: https:; " +
    "script-src 'self' 'unsafe-inline'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "connect-src 'self' http://localhost:* ws://localhost:* https://*.googleapis.com; " +
    "frame-ancestors 'none';"
  );

  // 8. Remove fingerprinting headers
  res.removeHeader('X-Powered-By');

  next();
}

module.exports = securityHeaders;
