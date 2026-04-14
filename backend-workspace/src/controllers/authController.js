const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');
const { AppError } = require('../middleware/errorHandler');
const { get, set } = require('../services/cacheService');

const register = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) throw new AppError('Email already exists', 400);
    const user = new User({ email, password, name, role });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    logger.info(`New user registered: ${email}`);
    res.status(201).json({ token, user: { id: user._id, email, name, role } });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cacheKey = `user:${email}`;
    let user = await get(cacheKey);
    if (!user) {
      user = await User.findOne({ email }).select('+password');
      if (user) await set(cacheKey, user.toJSON(), 300);
    }
    if (!user) throw new AppError('Invalid credentials', 401);
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new AppError('Invalid credentials', 401);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    logger.info(`User logged in: ${email}`);
    res.json({ token, user: { id: user._id, email, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar, phone, location } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, bio, avatar, phone, location }, { new: true }).select('-password');
    await set(`user:${user.email}`, user.toJSON(), 300);
    logger.info(`Profile updated for user: ${user.email}`);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new AppError('Current password is incorrect', 401);
    user.password = newPassword;
    await user.save();
    await set(`user:${user.email}`, user.toJSON(), 300);
    logger.info(`Password changed for user: ${user.email}`);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword };
