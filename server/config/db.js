const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️  MONGODB_URI is not defined in environment variables. Database operations will operate in mock/fallback mode.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
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

