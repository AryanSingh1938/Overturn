/**
 * =================================================================================================
 * OVERTURN SECURITY MIDDLEWARE — AUTHENTICATION & ROLE-BASED ACCESS CONTROL (middleware/auth.js)
 * =================================================================================================
 * Protects private endpoints against unauthorized access and enforces role-based authorization (RBAC).
 * Supports standard Bearer tokens, token expiration checks, and admin-only privilege isolation.
 * =================================================================================================
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'overturn_super_secret_jwt_key_2026_secure';

/**
 * Protect routes - verifies JWT in Authorization Bearer header
 */
async function protect(req, res, next) {
  let token;

  if (req.headers && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2) {
      token = parts[1].trim();
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this resource. Please sign in.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id || decoded._id;

    // Find user in database if connection is ready
    if (User.db && User.db.readyState === 1 && userId) {
      const user = await User.findById(userId).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    }

    // Fallback for decoded token if DB in mock/offline mode
    req.user = {
      _id: userId,
      id: userId,
      name: decoded.name || 'Policyholder',
      email: decoded.email || 'user@overturn.justice',
      role: decoded.role || 'policyholder',
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Session expired or invalid token. Please sign in again.',
    });
  }
}

/**
 * Restrict access to users possessing specific authorized roles
 * @param  {...string} roles - Permitted roles (e.g. 'admin', 'advocate')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to access this endpoint.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of the following roles: [${roles.join(', ')}]. Current role: '${req.user.role}'.`,
      });
    }

    next();
  };
}

/**
 * Convenience middleware for strictly administrator-only routes
 */
const requireAdmin = requireRole('admin');

module.exports = {
  protect,
  requireRole,
  requireAdmin,
  JWT_SECRET,
};
