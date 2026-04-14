import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'tham-platform-api' },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Custom HTTP logger middleware
const httpLogger = (req, res, next) => {
  // Skip logging for health checks and static files
  if (req.path === '/health' || 
      req.path === '/health/ping' || 
      req.path === '/health/ready' ||
      req.path === '/health/live' ||
      req.path.startsWith('/static/')) {
    return next();
  }

  const start = Date.now();
  const requestId = req.headers['x-request-id'] || require('crypto').randomUUID();

  // Log request
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Capture response
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    logger.info('Request completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  });

  next();
};

// Query logger for Sequelize (filtered)
const queryLogger = (sql, timing) => {
  // Don't log health check queries
  if (sql.includes('SELECT 1') || sql.includes('SHOW VARIABLES')) {
    return;
  }
  
  logger.debug('Database query', {
    sql: sql.length > 500 ? sql.substring(0, 500) + '...' : sql,
    timing: timing ? `${timing}ms` : 'N/A',
    timestamp: new Date().toISOString()
  });
};

export {
logger,
  httpLogger,
  queryLogger
};