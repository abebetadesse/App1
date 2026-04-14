import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.session.userRole === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }
};

// Apply admin middleware to all routes
router.use(isAdmin);

// GET /api/admin/dashboard
router.get('/dashboard', (req, res) => {
  res.json({
    success: true,
    message: 'Admin dashboard data',
    data: {
      stats: {
        totalUsers: 150,
        activeUsers: 45,
        totalRevenue: 12500,
        pendingRequests: 12,
      },
      recentActivities: [
        { id: 1, action: 'User registered', timestamp: new Date().toISOString() },
        { id: 2, action: 'Payment processed', timestamp: new Date().toISOString() },
      ],
    },
  });
});

// GET /api/admin/users
router.get('/users', (req, res) => {
  res.json({
    success: true,
    message: 'User list retrieved',
    data: {
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
      },
    },
  });
});

// POST /api/admin/users
router.post(
  '/users',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').isIn(['user', 'admin', 'moderator']).withMessage('Invalid role'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    res.json({
      success: true,
      message: 'User created successfully',
      data: {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString(),
      },
    });
  }
);

// PUT /api/admin/users/:id
router.put('/users/:id', (req, res) => {
  res.json({
    success: true,
    message: `User ${req.params.id} updated successfully`,
    data: {
      id: req.params.id,
      ...req.body,
      updatedAt: new Date().toISOString(),
    },
  });
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', (req, res) => {
  res.json({
    success: true,
    message: `User ${req.params.id} deleted successfully`,
  });
});

// GET /api/admin/settings
router.get('/settings', (req, res) => {
  res.json({
    success: true,
    message: 'Admin settings',
    data: {
      siteName: 'Tham Platform',
      maintenanceMode: false,
      registrationEnabled: true,
      maxFileSize: 10485760,
    },
  });
});

export default router;