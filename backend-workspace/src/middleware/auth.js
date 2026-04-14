const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) throw new Error();
    req.user = user;
    next();
  } catch (err) {
    logger.warn('Authentication failed', { error: err.message });
    res.status(401).json({ error: 'Authentication required' });
  }
};
