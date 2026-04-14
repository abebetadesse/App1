const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'payments endpoint active' });
});

module.exports = router;
