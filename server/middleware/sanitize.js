/**
 * =================================================================================================
 * OVERTURN SECURITY MIDDLEWARE — INPUT & NOSQL INJECTION SANITIZER (middleware/sanitize.js)
 * =================================================================================================
 * Protects MongoDB and Express controllers from:
 * - NoSQL Operator Injection (e.g. { "$gt": "" }, { "$ne": null }, { "$where": "..." })
 * - Prototype Pollution (__proto__, constructor, prototype)
 * - Basic XSS / Malicious Script Tags in form bodies
 * =================================================================================================
 */

/**
 * Recursively removes MongoDB operator keys (starting with '$' or containing '.')
 * and prototype pollution keywords from an object or array.
 */
function cleanNoSqlObject(obj) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanNoSqlObject);
  }

  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    // Block Prototype Pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }

    // Block MongoDB Query Operators
    if (key.startsWith('$') || key.includes('.')) {
      console.warn(`🛡️ [Security] Blocked prohibited NoSQL operator key: '${key}'`);
      continue;
    }

    cleaned[key] = cleanNoSqlObject(value);
  }

  return cleaned;
}

/**
 * Express middleware to sanitize body, query parameters, and route params
 */
function sanitizeNoSql(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = cleanNoSqlObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = cleanNoSqlObject(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = cleanNoSqlObject(req.params);
  }
  next();
}

/**
 * Recursively cleans dangerous script tags and null bytes from text strings in forms
 */
function cleanStringValue(val) {
  if (typeof val === 'string') {
    // Strip null bytes and control chars (except standard newlines / tabs)
    return val
      .replace(/\0/g, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  if (Array.isArray(val)) {
    return val.map(cleanStringValue);
  }
  if (val && typeof val === 'object') {
    const res = {};
    for (const [k, v] of Object.entries(val)) {
      res[k] = cleanStringValue(v);
    }
    return res;
  }
  return val;
}

function sanitizeForms(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = cleanStringValue(req.body);
  }
  next();
}

module.exports = {
  sanitizeNoSql,
  sanitizeForms,
  cleanNoSqlObject,
};
