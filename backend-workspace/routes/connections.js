const express = require('express');
const router = express.Router();
const { Connection, ProfileOwner } = require('../models');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, async (req, res) => {
  const { profileOwnerId } = req.body;
  const connection = await Connection.create({ clientId: req.user.id, profileOwnerId });
  const profile = await ProfileOwner.findByPk(profileOwnerId);
  res.json({ connection, phone: profile.phoneNumber });
});
router.get('/history', authenticate, async (req, res) => {
  const connections = await Connection.findAll({ where: { clientId: req.user.id } });
  res.json(connections);
});
module.exports = router;
