const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
require('dotenv').config();

/**
 * =================================================================================================
 * OVERTURN DATABASE CONFIGURATION — MONGODB ATLAS CONNECTOR (config/db.js)
 * =================================================================================================
 *
 * Manages the lifecycle of database connections to MongoDB Atlas using Mongoose ODM.
 * It initializes connection pools, detects placeholder credentials, and enables graceful fallback
 * when MongoDB is unavailable.
 * =================================================================================================
 */

const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the configured URI, or a local development database by default.
 *
 * Design guardrails:
 * - Fails fast via serverSelectionTimeoutMS so offline local demos don't stall.
 * - Detects unconfigured placeholder credentials and uses fallback data instead.
 *
 * @returns {Promise<mongoose.Connection|null>} Active Mongoose connection or null if operating in fallback mode
 */
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/overturn';

  if (uri.includes('<db_password>') || uri.includes('<password>') || uri.includes('<username>')) {
    console.warn('\n⚠️  NOTICE [MONGODB_URI]: Contains unconfigured placeholder credentials (<db_password> / <password>).');
    console.warn('👉 Replace <db_password> with your actual MongoDB Atlas database password in server/.env.');
    console.warn('   Operating with resilient mock/fallback data in the meantime for offline testing.\n');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      dbName: 'overturn',
      serverSelectionTimeoutMS: 5000,
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
