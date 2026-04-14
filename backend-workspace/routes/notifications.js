const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'notifications endpoint active' });
});

module.exports = router;
