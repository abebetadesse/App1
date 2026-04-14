const express = require('express');
const router = express.Router();
const { RankingCriteria } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');

router.use(authenticate, requireRole('admin'));
router.get('/ranking-criteria', async (req, res) => {
  const criteria = await RankingCriteria.findAll();
  res.json(criteria);
});
router.post('/ranking-criteria', async (req, res) => {
  const criteria = await RankingCriteria.create(req.body);
  res.json(criteria);
});
module.exports = router;
