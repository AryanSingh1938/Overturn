/**
 * =================================================================================================
 * OVERTURN CIVIC ENGINE — MASTER SERVER ENTRYPOINT (server.js)
 * =================================================================================================
 *
 * 1. FILE PURPOSE & ROLE:
 *    This file is the operational heart and HTTP bootstrap of the Overturn backend.
 *    It initializes the Express application, configures global security middleware (CORS, body parsers),
 *    establishes connection to MongoDB Atlas, mounts the modular REST routing controllers, and boots
 *    the HTTP listener with automatic macOS port failover (handling Port 5000 AirPlay conflicts).
 *
 * 2. WHY THIS FILE IS CRITICAL IN THE PIPELINE:
 *    Every incoming user request (from repudiation letter uploads to legal notice dispatch) enters
 *    here. Without this server configuration, the decoupled AI vision, vector search, limitation engine,
 *    and dispatch controllers cannot communicate with the React client (`client/`).
 *
 * 3. WORKFLOW POSITION:
 *    [ Client React UI ] ────► [ server.js (Bootstrap & Middleware) ] ────► [ routes/api.js & routes/auth.js ]
 *                                       │
 *                                       ▼
 *                               [ config/db.js (MongoDB Atlas) ]
 *
 * 4. IMPORTED MODULES & WHY THEY ARE CRITICAL:
 *    - `dotenv`: Loads local `.env` variables (MongoDB URI, Gemini API key, SMTP credentials).
 *    - `express`: High-performance HTTP application framework.
 *    - `cors`: Handles Cross-Origin Resource Sharing so our Vite React frontend (port 5173) can query
 *              the backend without browser security blocks.
 *    - `./config/db`: Database connection initializer supporting graceful offline fallbacks.
 *    - `./routes/api`: Primary API router hosting OCR audit, vector search, appeal generation, and dispatch.
 *    - `./routes/auth`: User registration, authentication, and JWT sessions.
 *
 * 5. CORE FUNCTIONS & INFRASTRUCTURE:
 *    - `connectDB()`: Invoked immediately at startup to test MongoDB connectivity.
 *    - `startServer(portToUse)`: Dynamic listener function with `EADDRINUSE` port-bumping logic.
 * =================================================================================================
 */

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

// Initialize Express web server application instance
const app = express();

// Default port configured via environment variable, falling back to 5000
const PORT = process.env.PORT || 5000;

// =================================================================================================
// STEP 1: INITIALIZE DATABASE CONNECTION
// Connects to MongoDB Atlas; if URI is not provided, operates in resilient offline fallback mode.
// =================================================================================================
connectDB();

// =================================================================================================
// STEP 2: CONFIGURE GLOBAL MIDDLEWARE
// =================================================================================================

// CORS Configuration: Allows cross-origin requests from the client dev server or production deployment
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body Parsers: Configured with 15MB limit to allow base64 image strings and large legal draft payloads
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Development Request Logger: Traces HTTP method, endpoint URL, and timestamp for auditing
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// =================================================================================================
// STEP 3: MOUNT MODULAR REST API ROUTES
// Dispatches authentication requests to authRoutes and civic engine operations to apiRoutes.
// =================================================================================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1', apiRoutes);

// Root informational endpoint: Provides health metadata, project description, and endpoint sitemap
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
      ombudsmanComplaint: 'POST /api/v1/generate-ombudsman-complaint',
      dispatch: 'POST /api/v1/dispatch-gro',
      status: 'GET /api/v1/case-status/:claimId',
      groDirectory: 'GET /api/v1/gro-directory',
      ombudsmanDirectory: 'GET /api/v1/ombudsman-directory',
      health: 'GET /api/v1/health',
    },
  });
});

// =================================================================================================
// STEP 4: CENTRALIZED ERROR HANDLER
// Catches unhandled asynchronous exceptions and formats clean JSON errors with legal disclaimers.
// =================================================================================================
app.use((err, req, res, next) => {
  console.error('⚠️ Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    statutory_disclaimer: 'Overturn is an automated procedural assistance platform, not a licensed legal practitioner or law firm, and does not provide formal legal advice.',
  });
});

// =================================================================================================
// STEP 5: RESILIENT HTTP SERVER STARTUP WITH PORT AUTO-INCREMENT
// macOS Monterey/Ventura/Sonoma binds Port 5000 to "AirPlay Receiver".
// If port 5000 is occupied, this logic catches EADDRINUSE and binds port 5001 automatically.
// =================================================================================================
function startServer(portToUse) {
  const server = app.listen(portToUse, () => {
    console.log(`\n======================================================`);
    console.log(`⚖️  OVERTURN BACKEND REST ENGINE ACTIVE`);
    console.log(`📡 Listening on: http://localhost:${portToUse}`);
    console.log(`🛠️  Health Check: http://localhost:${portToUse}/api/v1/health`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(portToUse) + 1;
      console.warn(`\n⚠️  Port ${portToUse} is in use (on macOS, port 5000 is reserved by AirPlay Receiver).`);
      console.warn(`🔄 Automatically switching and binding to fallback port: ${nextPort}...\n`);
      startServer(nextPort);
    } else {
      console.error('❌ Server startup error:', err);
      process.exit(1);
    }
  });

  return server;
}

startServer(PORT);

module.exports = app;
