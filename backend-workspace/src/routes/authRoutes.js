const express = require('express');
const { register, login, getProfile, updateProfile, changePassword } = require('../controllers/authController');
const { validate, userValidation } = require('../middleware/validation');
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, validate(userValidation.register), register);
router.post('/login', authLimiter, validate(userValidation.login), login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, validate(userValidation.updateProfile), updateProfile);
router.post('/change-password', auth, validate(userValidation.changePassword), changePassword);

module.exports = router;
