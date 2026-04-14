const { body, validationResult } = require('express-validator');
const logger = require('../config/logger');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    logger.warn('Validation failed', { errors: errors.array(), body: req.body });
    res.status(400).json({ errors: errors.array() });
  };
};

const userValidation = {
  register: [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty().trim(),
    body('role').optional().isIn(['client', 'profile_owner', 'admin']),
  ],
  login: [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  updateProfile: [
    body('name').optional().trim(),
    body('bio').optional().trim(),
    body('phone').optional(),
    body('location').optional(),
  ],
  changePassword: [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
  ],
};

module.exports = { validate, userValidation };
