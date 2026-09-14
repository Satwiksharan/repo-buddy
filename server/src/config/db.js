const mongoose = require('mongoose');
const config = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000 // Keep timeout short for development readiness
    });
    console.log(`[MongoDB] Database connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${config.mongoUri}. Features requiring persistence will be unavailable until MongoDB is active. Error: ${error.message}`);
    // Do not terminate process in dev so health endpoint still serves requests
    return null;
  }
};

module.exports = connectDB;
