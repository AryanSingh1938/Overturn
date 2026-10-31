const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'overturn_super_secret_jwt_key_2026_secure';

/**
 * Protect routes - verifies JWT in Authorization Bearer header
 */
async function protect(req, res, next) {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this resource. Please sign in.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user in database
    if (User.db && User.db.readyState === 1) {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    }

    // Fallback for decoded token if DB in mock mode
    req.user = {
      _id: decoded.id,
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

module.exports = {
  protect,
  JWT_SECRET,
};

