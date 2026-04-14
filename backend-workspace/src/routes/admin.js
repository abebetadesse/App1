// src/routes/admin.js
import express from 'express';
const router = express.Router();

// Import middleware correctly
import { requireAdmin, authenticateToken } from '../middleware/auth.js';

// Import controllers
import AdminController from '../controllers/AdminController.js';
import rankingController from '../controllers/rankingController.js';

// Apply admin middleware to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard routes
router.get('./dashboard', AdminController.getDashboardData);
router.get('./analytics/connections', AdminController.getConnectionAnalytics);
router.get('/analytics/ranking', rankingController.getRankingAnalytics);

// User management routes
router.get('./users', AdminController.getUserManagement);
router.put('/users/:userId/status', AdminController.updateUserStatus);
router.put('/profile-owners/:profileOwnerId/verify', AdminController.verifyProfileOwner);

// Ranking criteria management
router.get('/ranking-criteria', rankingController.getRankingCriteria);
router.post('/ranking-criteria', rankingController.createRankingCriteria);
router.put('/ranking-criteria/:id', rankingController.updateRankingCriteria);
router.delete('/ranking-criteria/:id', rankingController.deleteRankingCriteria);
router.post('/ranking/recalculate', rankingController.triggerRankingRecalculation);

// Test route to verify admin routes are working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Admin routes are working!',
    user: req.user 
  });
});

export default router;