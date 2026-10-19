require('dotenv').config();
const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');
const { initDatabase } = require('./config/initDatabase');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Ensure super admin, official settings, and plans exist in MongoDB
    await initDatabase();

    const server = http.createServer(app);

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`⚠️ Port ${PORT} is already in use by another process. Please terminate the process or change PORT in .env.`);
      } else {
        console.error('Server error:', err);
      }
    });

    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🌐 Server running live at: http://localhost:${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

startServer();
