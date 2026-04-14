import express from 'express';
const router = express.Router();

// Simple inline controller to avoid circular dependencies
const authController = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password, role, phoneNumber } = req.body;

      // Simple validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      // Mock response
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: Date.now(),
            firstName,
            lastName,
            email,
            role: role || 'profile_owner',
            phoneNumber
          },
          token: 'mock-jwt-token-' + Date.now()
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed'
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      // Mock response
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: email,
            role: email.includes('admin') ? 'admin' : 
                  email.includes('client') ? 'client' : 'profile_owner',
            phoneNumber: '+1234567890'
          },
          token: 'mock-jwt-token-' + Date.now()
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email is required'
        });
      }

      res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process request'
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Token and new password are required'
        });
      }

      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reset password'
      });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required'
        });
      }

      res.json({
        success: true,
        data: {
          accessToken: 'new-mock-jwt-token-' + Date.now()
        }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to refresh token'
      });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      // Simple mock user
      res.json({
        success: true,
        data: {
          user: {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'user@example.com',
            role: 'profile_owner',
            phoneNumber: '+1234567890'
          }
        }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user data'
      });
    }
  },

  logout: async (req, res) => {
    try {
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
  }
};

// Simple auth middleware (inline to avoid imports)
const simpleAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }
  
  // Mock token validation
  if (!token.startsWith('mock-jwt-token-')) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
  
  req.user = { 
    userId: 1, 
    email: 'user@example.com', 
    role: 'profile_owner' 
  };
  next();
};

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);

// Protected routes
router.post('/logout', simpleAuth, authController.logout);
router.get('/me', simpleAuth, authController.getCurrentUser);

// Basic auth routes
router.post('/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint',
    timestamp: new Date().toISOString()
  });
});

router.post('/register', (req, res) => {
  res.json({
    success: true,
    message: 'Register endpoint',
    timestamp: new Date().toISOString()
  });
});

export default router;