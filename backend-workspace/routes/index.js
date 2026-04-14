import express from 'express';
const router = express.Router();

// Import all route modules
import authRoutes from './auth.js';
import adminRoutes from './admin.js';
import rankingRoutes from './ranking.js';
import profileOwnerRoutes from './profile-owners.js';
import clientRoutes from './clients.js';
import searchRoutes from './search.js';
import paymentRoutes from './payments.js';
import uploadRoutes from './upload.js';

// Mount routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/admin', rankingRoutes); // Mount ranking under admin
router.use('/profile-owners', profileOwnerRoutes);
router.use('/clients', clientRoutes);
router.use('/search', searchRoutes);
router.use('/payments', paymentRoutes);
router.use('/upload', uploadRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

export default router;