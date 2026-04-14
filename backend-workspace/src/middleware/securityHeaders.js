import helmet from 'helmet';

// Custom security headers middleware
const securityHeaders = (req, res, next) => {
  // Additional security headers beyond what helmet provides
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Custom headers for API
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('X-Response-Time', Date.now() - (req.startTime || Date.now()));
  
  next();
};

export default securityHeaders;