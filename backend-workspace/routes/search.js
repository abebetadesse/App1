const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'search endpoint active' });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const MatchingEngine = require('../services/MatchingEngine');
const { authenticate } = require('../middleware/auth');

router.post('/profiles', authenticate, async (req, res) => {
  try {
    const matches = await MatchingEngine.findTopMatches(req.body.filters || {}, 10);
    res.json({ matches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
