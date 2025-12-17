const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const redisClient = require('./config/redis');
const vectorDbService = require('./services/vectorDbService');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes/api');
const config = require('./config/environment');
const { globalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Global rate limiting (applies to all /api routes)
app.use(globalLimiter);

// Routes
app.use('/api', apiRoutes);

// 404 handler 
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler 
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Initialize and start server
const startServer = async () => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    console.log('Database connected');

    // Initialize vector DB
    await vectorDbService.initializeCollection();
    console.log('Vector DB initialized');

    // Start server
    const server = app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
      console.log(`Environment: ${config.NODE_ENV}`);
    });

    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Server startup error:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
