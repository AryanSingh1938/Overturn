/**
 * =================================================================================================
 * OVERTURN DATABASE CONFIGURATION — MONGODB ATLAS CONNECTOR (config/db.js)
 * =================================================================================================
 *
 * 1. FILE PURPOSE & ROLE:
 *    Manages the lifecycle of database connections to MongoDB Atlas using Mongoose ODM.
 *    It initializes connection pools, enforces strict 5000ms timeouts to prevent server hangs,
 *    detects placeholder credentials, and enables graceful degradation to in-memory fallback mode.
 *
 * 2. WHY THIS FILE IS CRITICAL IN THE PIPELINE:
 *    The Overturn backend relies on MongoDB Atlas for:
 *    - Vector Search: Indexing and querying 768-dimensional normalized judicial precedent embeddings.
 *    - Case State Machine: Persisting claim records across the DRAFT -> DISPATCHED -> ESCALATED states.
 *    - GRO & Ombudsman Directory: Storing contact registries for 1-click dispatch.
 *    If MongoDB is temporarily unavailable or running in an offline test harness, this connector
 *    ensures the backend does NOT crash, allowing controllers to serve authentic in-memory fallbacks.
 *
 * 3. IMPORTED MODULES:
 *    - `mongoose`: Object Data Modeling (ODM) library for MongoDB.
 *
 * 4. KEY FUNCTION:
 *    - `connectDB()`: Asynchronous connector handling connection validation, error logging, and failover.
 * =================================================================================================
 */

const mongoose = require('mongoose');

/**
 * Connects to MongoDB Atlas cluster using URI specified in environment variables.
 *
 * Design Guardrails:
 * - 5-Second Timeout: Fails fast via serverSelectionTimeoutMS so offline local demos don't stall.
 * - Placeholder Protection: Detects unconfigured strings like '<db_password>' and warns the developer.
 * - Non-Fatal Error Handling: Catches connection errors and logs a clean warning rather than crashing.
 *
 * @returns {Promise<mongoose.Connection|null>} Active Mongoose connection or null if operating in fallback mode
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  // 1. Guardrail: Check if MONGODB_URI is provided
  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not defined in environment variables. Database operations will operate in mock/fallback mode.');
    return null;
  }

  // 2. Guardrail: Check for unconfigured placeholder strings from .env.example
  if (uri.includes('<db_password>') || uri.includes('<password>') || uri.includes('<username>')) {
    console.warn('\n⚠️  NOTICE [MONGODB_URI]: Contains unconfigured placeholder credentials (<db_password> / <password>).');
    console.warn('👉 Replace <db_password> with your actual MongoDB Atlas database password in server/.env.');
    console.warn('   Operating with resilient mock/fallback data in the meantime for offline testing.\n');
    return null;
  }

  // 3. Attempt connection to MongoDB Atlas
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging the process
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}:${conn.connection.port || 27017} (${conn.connection.name})`);
    return conn;
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    console.warn('⚠️  Continuing in fallback mode for offline/demonstration runs.');
    return null;
  }
};

module.exports = connectDB;
