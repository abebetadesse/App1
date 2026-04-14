const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'profile-owners endpoint active' });
});

module.exports = router;
