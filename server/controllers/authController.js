const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Ensure MongoDB database is connected and ready
 */
async function ensureDbConnected() {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  // If connecting (readyState === 2), wait for connection to finish
  if (mongoose.connection.readyState === 2) {
    const startTime = Date.now();
    while (mongoose.connection.readyState === 2 && Date.now() - startTime < 5000) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (mongoose.connection.readyState === 1) {
      return true;
    }
  }

  // Try establishing connection
  try {
    const conn = await connectDB();
    return !!(conn && mongoose.connection.readyState === 1);
  } catch (err) {
    console.error('❌ MongoDB Connection Error in authController:', err.message);
    return false;
  }
}

/**
 * Generate JWT token for user
 */
function generateToken(user) {
  const userId = (user._id || user.id || '').toString();
  return jwt.sign(
    {
      id: userId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// In-memory demo account store for evaluation
const DEMO_USER = {
  _id: 'usr_demo_849201',
  name: 'Advocate Rajesh Verma',
  email: 'demo@overturn.justice',
  role: 'policyholder',
  claimsCount: 2,
};

/**
 * Register new user - strictly stored in MongoDB 'users' collection
 */
async function register(req, res) {
  try {
    const { name, email, password, role = 'policyholder' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide full name, email address, and password.',
      });
    }

    if (typeof password === 'string' && password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Ensure MongoDB is connected
    const isReady = await ensureDbConnected();
    if (!isReady) {
      return res.status(503).json({
        success: false,
        error: 'Database unavailable: Could not connect to MongoDB overturn database. Please verify your MongoDB service is running.',
      });
    }

    // Check if email already registered
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email address already exists. Please sign in.',
      });
    }

    // Create user record directly in MongoDB users collection
    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password,
      role,
    });

    console.log(`✅ [MongoDB] Saved new user to overturn.users collection: ${user.email} (ID: ${user._id})`);

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        claimsCount: user.claimsCount || 0,
      },
    });
  } catch (err) {
    console.error('❌ Register Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Registration failed: ' + err.message,
    });
  }
}

/**
 * Login user
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Demo bypass for quick evaluation
    if (cleanEmail === 'demo@overturn.justice' && password === 'demo1234') {
      const token = generateToken(DEMO_USER);
      return res.status(200).json({
        success: true,
        token,
        user: {
          id: DEMO_USER._id,
          name: DEMO_USER.name,
          email: DEMO_USER.email,
          role: DEMO_USER.role,
          claimsCount: DEMO_USER.claimsCount,
        },
      });
    }

    // Ensure MongoDB is connected
    const isReady = await ensureDbConnected();
    if (!isReady) {
      return res.status(503).json({
        success: false,
        error: 'Database unavailable: Could not connect to MongoDB overturn database.',
      });
    }

    // Query user with password from MongoDB
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        claimsCount: user.claimsCount || 0,
      },
    });
  } catch (err) {
    console.error('❌ Login Error:', err);
    return res.status(500).json({
      success: false,
      error: 'Login failed: ' + err.message,
    });
  }
}

/**
 * Get current user profile
 */
async function getMe(req, res) {
  try {
    const isReady = await ensureDbConnected();
    if (isReady && req.user && (req.user._id || req.user.id)) {
      const userId = req.user._id || req.user.id;
      const dbUser = await User.findById(userId).select('-password');
      if (dbUser) {
        return res.status(200).json({
          success: true,
          user: {
            id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email,
            role: dbUser.role,
            claimsCount: dbUser.claimsCount || 0,
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        id: (req.user._id || req.user.id || '').toString(),
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        claimsCount: req.user.claimsCount || 0,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  register,
  login,
  getMe,
  ensureDbConnected,
};
