// models/index.cjs
const mongoose = require('mongoose');

// Create generic schema scaffolds for now so your server can boot.
// You can define strict fields (like email, password) later!
const genericSchema = new mongoose.Schema({}, { strict: false, timestamps: true });

module.exports = {
  User: mongoose.models.User || mongoose.model('User', genericSchema),
  ProfileOwner: mongoose.models.ProfileOwner || mongoose.model('ProfileOwner', genericSchema),
  Client: mongoose.models.Client || mongoose.model('Client', genericSchema),
  Connection: mongoose.models.Connection || mongoose.model('Connection', genericSchema),
  PaymentTransaction: mongoose.models.PaymentTransaction || mongoose.model('PaymentTransaction', genericSchema)
};