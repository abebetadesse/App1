const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const db = require('../config/database');

// POST /api/v1/jobs - Create job (client only)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { title, description, categoryPath, budgetType, budgetMin, budgetMax, duration, requiredSuccessScore, preScreeningQuestions } = req.body;
    const clientUserId = req.user.id;
    const result = await db.query(
      `INSERT INTO job_posts (client_user_id, title, description, category_path, budget_type, budget_min, budget_max, duration, required_success_score, pre_screening_questions, status, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'published', NOW() + INTERVAL '30 days') RETURNING *`,
      [clientUserId, title, description, categoryPath, budgetType, budgetMin, budgetMax, duration, requiredSuccessScore || 0, JSON.stringify(preScreeningQuestions || [])]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) { next(error); }
});

// GET /api/v1/jobs - List jobs with filters
router.get('/', async (req, res, next) => {
  try {
    const { category, minBudget, maxBudget, page = 1, limit = 20 } = req.query;
    // Implement filtered query...
    res.json({ jobs: [], total: 0 });
  } catch (error) { next(error); }
});

// POST /api/v1/jobs/:jobId/proposals - Submit proposal
router.post('/:jobId/proposals', authenticate, async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { profileId, coverLetter, bidAmount, estimatedDuration, isBoosted } = req.body;
    // Deduct connects, create proposal...
    res.status(201).json({ proposalId: 'uuid' });
  } catch (error) { next(error); }
});

module.exports = router;
