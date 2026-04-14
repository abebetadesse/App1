const requestLogger = (req, res, next) => {
  req.startTime = Date.now();
  req.requestId = require('uuid').v4();
  
  // Log request details (excluding sensitive data)
  console.log(`📨 ${req.method} ${req.path} - ID: ${req.requestId} - IP: ${req.ip}`);
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - req.startTime;
    const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
    
    console.log(`📤 ${logLevel} ${req.method} ${req.path} - Status: ${res.statusCode} - Duration: ${duration}ms - ID: ${req.requestId}`);
  });
  
  next();
};

export default requestLogger;