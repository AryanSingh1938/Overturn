/**
 * =================================================================================================
 * OVERTURN SECURITY AUDIT & HARDENING TEST SUITE (tests/security.test.js)
 * =================================================================================================
 * Verifies all security defenses implemented during the security audit:
 * 1. Role Escalation Defense: Blocks public self-registration with 'admin' role
 * 2. NoSQL Injection & Prototype Pollution Sanitization
 * 3. Security Headers: Verifies CSP, X-Frame-Options, X-Content-Type-Options
 * 4. Rate Limiting: Verifies rate limiter tracking & header emission
 * 5. Admin RBAC Gate: Blocks non-admin users from administrative endpoints
 * 6. Multi-Tenant Dispute Isolation (BOLA/IDOR Defense)
 * =================================================================================================
 */

const test = require('node:test');
const assert = require('node:assert');
const { cleanNoSqlObject } = require('../middleware/sanitize');
const securityHeaders = require('../middleware/securityHeaders');
const { createRateLimiter } = require('../middleware/rateLimiter');
const { requireRole } = require('../middleware/auth');
const { register } = require('../controllers/authController');
const { getUserCases } = require('../controllers/dispatchController');

// -------------------------------------------------------------------------------------------------
// TEST 1: ROLE ESCALATION DEFENSE
// -------------------------------------------------------------------------------------------------
test('Security Defense: Prevents privilege escalation to admin in public registration', async () => {
  const req = {
    body: {
      name: 'Malicious Actor',
      email: 'attacker@exploit.internal',
      password: 'password123',
      role: 'admin', // Attempting privilege escalation
    },
  };

  let responseData = null;
  let statusCode = 200;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
  };

  await register(req, res);

  assert.strictEqual(statusCode, 400, 'Self-registering as admin must be rejected with 400');
  assert.strictEqual(responseData.success, false);
  assert.ok(responseData.error.includes('prohibited'), 'Error must explicitly state admin self-registration is prohibited');
});

// -------------------------------------------------------------------------------------------------
// TEST 2: NOSQL INJECTION & PROTOTYPE POLLUTION DEFENSE
// -------------------------------------------------------------------------------------------------
test('Security Defense: Strips NoSQL operators ($gt, $ne, $where) and prototype pollution keys', () => {
  const maliciousPayload = {
    email: { $gt: '' },
    username: 'legit_user',
    nested: {
      $where: 'sleep(5000)',
      safeField: 'hello',
      'dot.injection': 'evil',
    },
    __proto__: { isAdmin: true },
  };

  const cleaned = cleanNoSqlObject(maliciousPayload);

  assert.strictEqual(cleaned.email.$gt, undefined, 'Must strip $gt key');
  assert.strictEqual(Object.keys(cleaned.email).length, 0, 'Cleaned object has no operators');
  assert.strictEqual(cleaned.username, 'legit_user', 'Must preserve legitimate fields');
  assert.strictEqual(cleaned.nested.safeField, 'hello', 'Must preserve legitimate nested fields');
  assert.strictEqual(cleaned.nested.$where, undefined, 'Must strip nested $where operator');
  assert.strictEqual(cleaned.nested['dot.injection'], undefined, 'Must strip dot-delimited operator');
  assert.strictEqual(Object.prototype.isAdmin, undefined, 'Prototype must not be polluted');
});

// -------------------------------------------------------------------------------------------------
// TEST 3: HTTP SECURITY HEADERS
// -------------------------------------------------------------------------------------------------
test('Security Defense: Sets comprehensive HTTP security headers', () => {
  const headers = {};
  const req = {};
  const res = {
    setHeader(name, value) {
      headers[name.toLowerCase()] = value;
    },
    removeHeader(name) {
      delete headers[name.toLowerCase()];
    },
  };

  let nextCalled = false;
  securityHeaders(req, res, () => {
    nextCalled = true;
  });

  assert.ok(nextCalled, 'Middleware must call next()');
  assert.strictEqual(headers['x-content-type-options'], 'nosniff');
  assert.strictEqual(headers['x-frame-options'], 'DENY');
  assert.strictEqual(headers['x-xss-protection'], '1; mode=block');
  assert.strictEqual(headers['referrer-policy'], 'strict-origin-when-cross-origin');
  assert.ok(headers['content-security-policy'], 'Must set Content-Security-Policy');
  assert.ok(headers['permissions-policy'], 'Must set Permissions-Policy');
});

// -------------------------------------------------------------------------------------------------
// TEST 4: RATE LIMITER MECHANISM
// -------------------------------------------------------------------------------------------------
test('Security Defense: Sliding window rate limiter enforces request thresholds and 429', () => {
  // Save previous env
  const prevEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  const limiter = createRateLimiter({
    windowMs: 1000,
    max: 3,
    message: 'Test rate limit exceeded.',
  });

  const req = { ip: '198.51.100.1' };
  let lastStatus = 200;
  let lastBody = null;

  const res = {
    setHeader() {},
    status(code) {
      lastStatus = code;
      return this;
    },
    json(body) {
      lastBody = body;
      return this;
    },
  };

  // Dispatch 3 requests (within max)
  limiter(req, res, () => {});
  assert.strictEqual(lastStatus, 200);
  limiter(req, res, () => {});
  assert.strictEqual(lastStatus, 200);
  limiter(req, res, () => {});
  assert.strictEqual(lastStatus, 200);

  // 4th request must be throttled with HTTP 429
  limiter(req, res, () => {});
  assert.strictEqual(lastStatus, 429, '4th request must be rejected with 429 Too Many Requests');
  assert.strictEqual(lastBody.success, false);

  // Restore env
  process.env.NODE_ENV = prevEnv;
});

// -------------------------------------------------------------------------------------------------
// TEST 5: ADMIN ROLE RBAC AUTHORIZATION GATE
// -------------------------------------------------------------------------------------------------
test('Security Defense: requireRole blocks non-admin users with 403 Forbidden', () => {
  const requireAdmin = requireRole('admin');

  // Case A: Regular policyholder user
  const nonAdminReq = {
    user: {
      _id: 'usr_normal_123',
      name: 'Normal User',
      email: 'user@example.com',
      role: 'policyholder',
    },
  };

  let statusCode = 200;
  let responseData = null;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
  };

  requireAdmin(nonAdminReq, res, () => {});
  assert.strictEqual(statusCode, 403, 'Regular policyholder must be blocked with 403');
  assert.strictEqual(responseData.success, false);

  // Case B: Admin user passes through
  const adminReq = {
    user: {
      _id: 'usr_admin_999',
      name: 'Admin User',
      email: 'admin@overturn.justice',
      role: 'admin',
    },
  };

  let passed = false;
  requireAdmin(adminReq, res, () => {
    passed = true;
  });
  assert.strictEqual(passed, true, 'Admin user must pass through');
});

// -------------------------------------------------------------------------------------------------
// TEST 6: MULTI-TENANT ISOLATION (BOLA / IDOR DEFENSE)
// -------------------------------------------------------------------------------------------------
test('Security Defense: getUserCases blocks user from querying another user dispute records', async () => {
  // Attacker is authenticated as 'attacker@exploit.internal' but queries victim's email
  const req = {
    user: {
      id: 'usr_attacker',
      email: 'attacker@exploit.internal',
      role: 'policyholder',
    },
    query: {
      email: 'victim@innocent.com', // Attempted BOLA / IDOR
    },
  };

  let statusCode = 200;
  let responseData = null;
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      responseData = data;
      return this;
    },
  };

  await getUserCases(req, res);

  assert.strictEqual(statusCode, 403, 'Querying another user disputes must be rejected with 403');
  assert.strictEqual(responseData.success, false);
});
