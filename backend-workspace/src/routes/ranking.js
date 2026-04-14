import express from 'express';
const router = express.Router();
import rankingController from '../controllers/rankingController.js';
import { validate, validateParams, validateQuery } from '../utils/validators.js';
import { requireAdmin } from '../middleware/auth.js';

// Apply admin middleware to all routes
router.use(requireAdmin);

// Ranking analytics
router.get('/analytics/ranking', rankingController.getRankingAnalytics);

// Ranking criteria management
router.get('/ranking-criteria', rankingController.getRankingCriteria);
router.post('/ranking-criteria', 
  validate(validators.ranking.createCriteria),
  rankingController.createRankingCriteria
);
router.put('/ranking-criteria/:id',
  validateParams(Joi.object({ id: validators.common.id })),
  validate(validators.ranking.updateCriteria),
  rankingController.updateRankingCriteria
);
router.delete('/ranking-criteria/:id',
  validateParams(Joi.object({ id: validators.common.id })),
  rankingController.deleteRankingCriteria
);

// Ranking recalculation
router.post('/ranking/recalculate', rankingController.triggerRankingRecalculation);

export default router;