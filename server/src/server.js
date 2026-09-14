const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');

const startServer = async () => {
  // Connect to database
  await connectDB();

  const PORT = config.port;
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[RepoBuddy API] Server running in ${config.nodeEnv} mode on port ${PORT}`);
    console.log(`[RepoBuddy API] Health check endpoint: http://127.0.0.1:${PORT}/api/health`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection] Error: ${err.message}`);
  });
};

startServer();
