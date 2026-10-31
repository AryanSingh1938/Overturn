const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT token for user
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// In-memory demo users store for fallback when database is starting
const IN_MEMORY_USERS = new Map();
IN_MEMORY_USERS.set('demo@overturn.justice', {
  _id: 'usr_demo_849201',
  name: 'Advocate Rajesh Verma',
  email: 'demo@overturn.justice',
  role: 'policyholder',
  claimsCount: 2,
});

/**
 * Register new user
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

    const cleanEmail = email.toLowerCase().trim();

    // Check if user exists in database
    if (User.db && User.db.readyState === 1) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'An account with this email address already exists. Please sign in.',
        });
      }

      const user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        role,
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          claimsCount: user.claimsCount,
        },
      });
    }

    // In-Memory Fallback if local DB is offline
    const fakeId = 'usr_' + Date.now();
    const mockUser = {
      _id: fakeId,
      name: name.trim(),
      email: cleanEmail,
      role,
      claimsCount: 0,
    };
    IN_MEMORY_USERS.set(cleanEmail, mockUser);
    const token = generateToken(mockUser);

    return res.status(201).json({
      success: true,
      token,
      user: mockUser,
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

    // Demo bypass for quick hackathon evaluation
    if (cleanEmail === 'demo@overturn.justice' && password === 'demo1234') {
      const demoUser = IN_MEMORY_USERS.get('demo@overturn.justice');
      const token = generateToken(demoUser);
      return res.status(200).json({
        success: true,
        token,
        user: demoUser,
      });
    }

    if (User.db && User.db.readyState === 1) {
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
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          claimsCount: user.claimsCount,
        },
      });
    }

    // Fallback in-memory
    if (IN_MEMORY_USERS.has(cleanEmail)) {
      const user = IN_MEMORY_USERS.get(cleanEmail);
      const token = generateToken(user);
      return res.status(200).json({
        success: true,
        token,
        user,
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid credentials. (Or sign in with Demo Account: demo@overturn.justice / demo1234)',
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
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  register,
  login,
  getMe,
};

