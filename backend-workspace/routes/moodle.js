const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'moodle endpoint active' });
});

module.exports = router;
