import { ValidationError } from 'joi';
import { Sequelize } from 'sequelize';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.stack = err.stack;

  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user ? req.user.id : 'unauthenticated'
  });

  // Sequelize validation error
  if (err instanceof Sequelize.ValidationError) {
    const messages = err.errors.map(error => ({
      field: error.path,
      message: error.message
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      messages: messages,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
  }

  // Sequelize unique constraint error
  if (err instanceof Sequelize.UniqueConstraintError) {
    const messages = err.errors.map(error => ({
      field: error.path,
      message: `${error.path} already exists`
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Duplicate Entry',
      messages: messages,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
  }

  // Sequelize foreign key constraint error
  if (err instanceof Sequelize.ForeignKeyConstraintError) {
    return res.status(400).json({
      success: false,
      error: 'Reference Error',
      message: 'Invalid reference in request',
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
  }

  // Joi validation error
  if (err instanceof ValidationError) {
    const messages = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      messages: messages,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
  }

  // JWT errors
  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      error: 'Invalid Token',
      message: 'Authentication token is invalid'
    });
  }

  if (err instanceof TokenExpiredError) {
    return res.status(401).json({
      success: false,
      error: 'Token Expired',
      message: 'Authentication token has expired'
    });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID',
      message: 'The provided ID is invalid'
    });
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File Too Large',
      message: 'Uploaded file exceeds size limit'
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      error: 'Unexpected File',
      message: 'Unexpected file field in upload'
    });
  }

  // Default to 500 server error
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: err.name || 'Server Error',
    message: err.message || 'Something went wrong on the server',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export {
errorHandler
};