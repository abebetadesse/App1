import express from 'express';
const router = express.Router();

// GET /api/env - Get environment information (safe version)
router.get('/', (req, res) => {
  // Only expose safe environment variables
  const safeEnv = {
    NODE_ENV: process.env.NODE_ENV,
    SERVER_URL: process.env.SERVER_URL,
    APP_VERSION: '2.0.0',
    DATABASE: process.env.DB_DIALECT,
    UPLOAD_MAX_SIZE: process.env.MAX_FILE_SIZE,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
    RATE_LIMIT: process.env.RATE_LIMIT_MAX_REQUESTS,
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE || false,
    // Add other safe variables as needed
  };
  
  res.json({
    success: true,
    message: 'Environment configuration',
    data: safeEnv,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/env/health - Health check endpoint
router.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(process.memoryUsage().external / 1024 / 1024)}MB`,
    },
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    database: 'MySQL',
    features: {
      fileUpload: true,
      session: true,
      rateLimit: true,
      compression: true,
    },
  };
  
  res.json({
    success: true,
    message: 'System health status',
    data: health,
  });
});

// GET /api/env/status - Detailed system status
router.get('/status', (req, res) => {
  const status = {
    server: {
      name: 'Tham Platform API',
      version: '2.0.0',
      environment: process.env.NODE_ENV || 'development',
      startedAt: new Date(Date.now() - process.uptime() * 1000).toISOString(),
      currentTime: new Date().toISOString(),
    },
    database: {
      type: 'MySQL',
      status: 'connected', // This should be checked from database connection
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME,
    },
    features: {
      authentication: true,
      fileUpload: process.env.MAX_FILE_SIZE ? true : false,
      sessions: true,
      cors: process.env.ALLOWED_ORIGINS ? true : false,
      rateLimiting: process.env.RATE_LIMIT_MAX_REQUESTS ? true : false,
    },
    limits: {
      fileSize: process.env.MAX_FILE_SIZE,
      requestSize: '10mb',
      rateLimit: process.env.RATE_LIMIT_MAX_REQUESTS,
      sessionDuration: process.env.SESSION_MAX_AGE,
    },
    endpoints: {
      total: 11, // Number of route files
      authenticated: ['admin', 'employee', 'leader', 'waiter'],
      public: ['env', 'food', 'gallery', 'student', 'attendance', 'chatting', 'ecommerce'],
    },
  };
  
  res.json({
    success: true,
    message: 'System status',
    data: status,
  });
});

// GET /api/env/logs - Get recent logs (mock)
router.get('/logs', (req, res) => {
  const { limit = 10 } = req.query;
  
  const mockLogs = [
    { timestamp: new Date().toISOString(), level: 'info', message: 'Server started successfully' },
    { timestamp: new Date(Date.now() - 60000).toISOString(), level: 'info', message: 'Database connection established' },
    { timestamp: new Date(Date.now() - 120000).toISOString(), level: 'debug', message: 'Session store initialized' },
  ];
  
  res.json({
    success: true,
    message: 'Recent system logs',
    data: {
      logs: mockLogs.slice(0, parseInt(limit)),
      total: mockLogs.length,
    },
  });
});

// POST /api/env/log - Log a message (for debugging)
router.post('/log', (req, res) => {
  const { level = 'info', message, source = 'client' } = req.body;
  
  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Log message is required',
    });
  }
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    source,
    ip: req.ip,
  };
  
  console.log(`[${level.toUpperCase()}] ${message} (Source: ${source})`);
  
  res.json({
    success: true,
    message: 'Log recorded',
    data: logEntry,
  });
});

// GET /api/env/config - Get configuration (admin only)
router.get('/config', (req, res) => {
  // Check if user is admin (simplified)
  if (req.session.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
  
  // Return more detailed config (still filtered)
  const config = {
    server: {
      port: process.env.PORT,
      env: process.env.NODE_ENV,
      url: process.env.SERVER_URL,
    },
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME,
      dialect: process.env.DB_DIALECT,
    },
    security: {
      sessionSecretSet: !!process.env.SESSION_SECRET,
      corsEnabled: !!process.env.ALLOWED_ORIGINS,
      rateLimitEnabled: !!process.env.RATE_LIMIT_MAX_REQUESTS,
    },
    features: {
      fileUpload: {
        enabled: !!process.env.MAX_FILE_SIZE,
        maxSize: process.env.MAX_FILE_SIZE,
      },
      sessions: {
        enabled: true,
        maxAge: process.env.SESSION_MAX_AGE,
      },
    },
  };
  
  res.json({
    success: true,
    message: 'Server configuration (admin view)',
    data: config,
  });
});

export default router;