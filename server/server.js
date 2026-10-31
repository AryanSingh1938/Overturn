require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas (graceful fallback if URI unconfigured)
connectDB();

// Global Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Mount API v1 router
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', apiRoutes);

// Root informational endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Overturn API Service',
    description: 'Autonomous Precedent-Backed Claim Denial & Civic Appeal Engine',
    theme: 'Theme 1: Civic Pulse, Digital Governance & Public Information',
    version: '1.0.0',
    documentation: 'https://github.com/AryanSingh1938/Overturn#readme',
    endpoints: {
      analyze: 'POST /api/v1/analyze-rejection',
      search: 'POST /api/v1/search-precedents',
      generate: 'POST /api/v1/generate-appeal',
      dispatch: 'POST /api/v1/dispatch-gro',
      status: 'GET /api/v1/case-status/:claimId',
      groDirectory: 'GET /api/v1/gro-directory',
      health: 'GET /api/v1/health',
    },
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('⚠️ Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    statutory_disclaimer: 'Overturn is an automated procedural assistance platform, not a licensed legal practitioner or law firm, and does not provide formal legal advice.',
  });
});

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`⚖️  OVERTURN BACKEND REST ENGINE ACTIVE`);
  console.log(`📡 Listening on: http://localhost:${PORT}`);
  console.log(`🛠️  Health Check: http://localhost:${PORT}/api/v1/health`);
  console.log(`======================================================\n`);
});

module.exports = app;

