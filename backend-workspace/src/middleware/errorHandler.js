const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ error: message });
};

class AppError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = { errorHandler, AppError };
