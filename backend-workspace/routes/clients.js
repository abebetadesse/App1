const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'clients endpoint active' });
});

module.exports = router;
